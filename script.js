jQuery(document).ready(function($) {
    let currentResults = [];
    let selectedEntity = null;

    $('#kg-search-button').on('click', function() {
        const query = $('#kg-search-input').val().trim();
        if (!query) return;

        $(this).prop('disabled', true).text('Searching...');

        $.ajax({
            url: kgClaimTool.ajax_url,
            type: 'POST',
            data: {
                action: 'search_knowledge_graph',
                nonce: kgClaimTool.nonce,
                query: query
            },
            success: function(response) {
                if (response.success) {
                    currentResults = response.data;
                    displayResults(currentResults);
                    showStep('results');
                } else {
                    alert('Error: ' + response.data.message);
                }
            },
            error: function() {
                alert('Search failed. Please try again.');
            },
            complete: function() {
                $('#kg-search-button').prop('disabled', false).text('Search');
            }
        });
    });

    $('#kg-search-input').on('keypress', function(e) {
        if (e.which === 13) {
            $('#kg-search-button').click();
        }
    });

    $('#kg-back-button').on('click', function() {
        showStep('search');
    });

    $('#kg-start-over').on('click', function() {
        $('#kg-search-input').val('');
        showStep('search');
    });

    function displayResults(results) {
        const $resultsList = $('#kg-results-list');
        $resultsList.empty();

        if (results.length === 0) {
            $resultsList.html('<div class="kg-no-results">No results found. Try a different search.</div>');
            return;
        }

        results.forEach(function(result) {
            const $card = $('<div class="kg-result-card"></div>');

            const imageHtml = result.image
                ? '<img src="' + result.image + '" alt="' + result.name + '" class="kg-result-image" />'
                : '<div class="kg-result-image-placeholder">No Image</div>';

            const panelBadge = result.hasKnowledgePanel
                ? '<span class="kg-badge kg-badge-success">Has Knowledge Panel</span>'
                : '<span class="kg-badge kg-badge-default">No Knowledge Panel Yet</span>';

            $card.html(
                '<div class="kg-result-content">' +
                    imageHtml +
                    '<div class="kg-result-info">' +
                        '<h3>' + result.name + '</h3>' +
                        '<div class="kg-result-type">' + result.type + '</div>' +
                        '<p>' + result.description + '</p>' +
                        panelBadge +
                    '</div>' +
                '</div>'
            );

            $card.on('click', function() {
                selectedEntity = result;
                displayClaimStep(result);
                showStep('claim');
            });

            $resultsList.append($card);
        });
    }

    function displayClaimStep(entity) {
        const $entitySection = $('#kg-selected-entity');
        const $instructions = $('#kg-claim-instructions');

        const imageHtml = entity.image
            ? '<img src="' + entity.image + '" alt="' + entity.name + '" class="kg-entity-image" />'
            : '<div class="kg-entity-image-placeholder">No Image</div>';

        $entitySection.html(
            '<div class="kg-entity-card">' +
                imageHtml +
                '<div>' +
                    '<h3>' + entity.name + '</h3>' +
                    '<p>' + entity.description + '</p>' +
                '</div>' +
            '</div>'
        );

        if (entity.hasKnowledgePanel) {
            $instructions.html(
                '<div class="kg-claim-box">' +
                    '<h3>How to Claim Your Knowledge Panel</h3>' +
                    '<ol class="kg-steps-list">' +
                        '<li>' +
                            '<strong>Click the button below</strong>' +
                            '<p>This will open Google and search for "' + entity.name + '"</p>' +
                        '</li>' +
                        '<li>' +
                            '<strong>Look for the Knowledge Panel box</strong>' +
                            '<p>It appears on the right side of the Google search results</p>' +
                        '</li>' +
                        '<li>' +
                            '<strong>Click "Claim this knowledge panel"</strong>' +
                            '<p>Google will ask you to verify your identity</p>' +
                        '</li>' +
                        '<li>' +
                            '<strong>Complete Google\'s verification</strong>' +
                            '<p>This usually takes a few days for Google to review</p>' +
                        '</li>' +
                    '</ol>' +
                    '<a href="https://www.google.com/search?q=' + encodeURIComponent(entity.name) + '" ' +
                        'target="_blank" class="button button-primary button-hero kg-search-google">' +
                        'Search "' + entity.name + '" on Google →' +
                    '</a>' +
                    '<p class="kg-help-link">' +
                        '<a href="https://support.google.com/knowledgepanel/answer/7534842" target="_blank">' +
                            'View Google\'s Help Guide' +
                        '</a>' +
                    '</p>' +
                '</div>'
            );
        } else {
            $instructions.html(
                '<div class="kg-no-panel-box">' +
                    '<h3>No Knowledge Panel Found Yet</h3>' +
                    '<p>"' + entity.name + '" doesn\'t appear to have a Knowledge Panel on Google yet.</p>' +
                    '<p class="kg-small-text">Knowledge Panels are created automatically by Google. Keep building your online presence and check back later.</p>' +
                '</div>'
            );
        }
    }

    function showStep(step) {
        $('.kg-content-section').removeClass('active');
        $('.kg-step').removeClass('active completed');

        if (step === 'search') {
            $('#kg-search-step').addClass('active');
            $('.kg-step[data-step="search"]').addClass('active');
        } else if (step === 'results') {
            $('#kg-results-step').addClass('active');
            $('.kg-step[data-step="search"]').addClass('completed');
            $('.kg-step[data-step="results"]').addClass('active');
        } else if (step === 'claim') {
            $('#kg-claim-step').addClass('active');
            $('.kg-step[data-step="search"]').addClass('completed');
            $('.kg-step[data-step="results"]').addClass('completed');
            $('.kg-step[data-step="claim"]').addClass('active');
        }
    }
});
