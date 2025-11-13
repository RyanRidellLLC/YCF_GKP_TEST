<?php
/**
 * Plugin Name: Knowledge Panel Claim Tool
 * Description: Search Google Knowledge Graph and help users claim their knowledge panel
 * Version: 1.0.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) {
    exit;
}

class Knowledge_Panel_Claim_Tool {

    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_styles'));
        add_action('wp_ajax_search_knowledge_graph', array($this, 'ajax_search_knowledge_graph'));
    }

    public function add_admin_menu() {
        add_menu_page(
            'Knowledge Panel Tool',
            'KG Claim Tool',
            'manage_options',
            'kg-claim-tool',
            array($this, 'render_admin_page'),
            'dashicons-search',
            30
        );
    }

    public function enqueue_styles($hook) {
        if ($hook !== 'toplevel_page_kg-claim-tool') {
            return;
        }

        wp_enqueue_style('kg-claim-tool-css', plugin_dir_url(__FILE__) . 'style.css');
        wp_enqueue_script('kg-claim-tool-js', plugin_dir_url(__FILE__) . 'script.js', array('jquery'), '1.0', true);
        wp_localize_script('kg-claim-tool-js', 'kgClaimTool', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('kg_claim_tool_nonce')
        ));
    }

    public function ajax_search_knowledge_graph() {
        check_ajax_referer('kg_claim_tool_nonce', 'nonce');

        $query = sanitize_text_field($_POST['query']);
        $api_key = get_option('kg_claim_tool_api_key');

        if (empty($api_key)) {
            wp_send_json_error(array('message' => 'API key not configured'));
            return;
        }

        $url = 'https://kgsearch.googleapis.com/v1/entities:search?' . http_build_query(array(
            'query' => $query,
            'key' => $api_key,
            'limit' => 20
        ));

        $response = wp_remote_get($url);

        if (is_wp_error($response)) {
            wp_send_json_error(array('message' => 'API request failed'));
            return;
        }

        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        $results = array();

        if (isset($data['itemListElement'])) {
            foreach ($data['itemListElement'] as $item) {
                $result = $item['result'];
                $results[] = array(
                    'id' => isset($result['@id']) ? $result['@id'] : uniqid(),
                    'name' => isset($result['name']) ? $result['name'] : $query,
                    'type' => isset($result['@type'][0]) ? $result['@type'][0] : 'Unknown',
                    'description' => isset($result['description']) ? $result['description'] : (isset($result['detailedDescription']['articleBody']) ? $result['detailedDescription']['articleBody'] : 'No description'),
                    'image' => isset($result['image']['contentUrl']) ? $result['image']['contentUrl'] : (isset($result['image']['url']) ? $result['image']['url'] : ''),
                    'url' => isset($result['detailedDescription']['url']) ? $result['detailedDescription']['url'] : 'https://www.google.com/search?q=' . urlencode($result['name']),
                    'hasKnowledgePanel' => isset($result['detailedDescription'])
                );
            }
        }

        wp_send_json_success($results);
    }

    public function render_admin_page() {
        $api_key = get_option('kg_claim_tool_api_key', '');

        if (isset($_POST['save_api_key'])) {
            check_admin_referer('kg_claim_tool_settings');
            update_option('kg_claim_tool_api_key', sanitize_text_field($_POST['api_key']));
            $api_key = $_POST['api_key'];
            echo '<div class="notice notice-success"><p>API Key saved!</p></div>';
        }
        ?>
        <div class="wrap kg-claim-tool">
            <h1>Knowledge Panel Claim Tool</h1>

            <div class="kg-settings-section">
                <h2>Settings</h2>
                <form method="post">
                    <?php wp_nonce_field('kg_claim_tool_settings'); ?>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Google API Key</th>
                            <td>
                                <input type="text" name="api_key" value="<?php echo esc_attr($api_key); ?>" class="regular-text" />
                                <p class="description">
                                    Get your API key from <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a>.
                                    Enable "Knowledge Graph Search API" for your project.
                                </p>
                            </td>
                        </tr>
                    </table>
                    <p class="submit">
                        <input type="submit" name="save_api_key" class="button button-primary" value="Save API Key" />
                    </p>
                </form>
            </div>

            <?php if (!empty($api_key)) : ?>
            <div class="kg-tool-section">
                <div id="kg-step-indicator">
                    <div class="kg-step active" data-step="search">
                        <div class="kg-step-icon">1</div>
                        <div class="kg-step-label">Search</div>
                    </div>
                    <div class="kg-step-line"></div>
                    <div class="kg-step" data-step="results">
                        <div class="kg-step-icon">2</div>
                        <div class="kg-step-label">Select</div>
                    </div>
                    <div class="kg-step-line"></div>
                    <div class="kg-step" data-step="claim">
                        <div class="kg-step-icon">3</div>
                        <div class="kg-step-label">Claim</div>
                    </div>
                </div>

                <div id="kg-search-step" class="kg-content-section active">
                    <h2>Step 1: Search Your Name</h2>
                    <p>Type your name, brand, or company exactly as it appears on Google</p>

                    <div class="kg-search-form">
                        <input type="text" id="kg-search-input" placeholder="Enter your name or brand..." />
                        <button id="kg-search-button" class="button button-primary button-large">Search</button>
                    </div>

                    <div class="kg-tips">
                        <h3>Quick Tips:</h3>
                        <ul>
                            <li>Use your full name as it appears publicly</li>
                            <li>For businesses, include "Inc" or "LLC" if applicable</li>
                            <li>Try different variations if you don't find results</li>
                        </ul>
                    </div>
                </div>

                <div id="kg-results-step" class="kg-content-section">
                    <button id="kg-back-button" class="button">← Back to Search</button>
                    <h2>Step 2: Select Your Entity</h2>
                    <p>Click on the result that matches you or your brand</p>
                    <div id="kg-results-list"></div>
                </div>

                <div id="kg-claim-step" class="kg-content-section">
                    <h2>Step 3: Claim Your Knowledge Panel</h2>
                    <div id="kg-selected-entity"></div>
                    <div id="kg-claim-instructions"></div>
                    <button id="kg-start-over" class="button">Search Another Name</button>
                </div>
            </div>
            <?php endif; ?>
        </div>
        <?php
    }
}

new Knowledge_Panel_Claim_Tool();
