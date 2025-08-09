/**
 * Presentation Settings Directive
 * Listens for settings changes and applies them to the presentation window
 */

(function() {
    'use strict';

    angular.module('ps').directive('presentationSettings', function($rootScope, StorageService, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var defaultSettings = {
                    backgroundMode: 'cover',
                    customBackgroundUrl: null,
                    customBackgroundName: null
                };

                var currentSettings = angular.copy(defaultSettings);

                // Load settings from storage on init
                function loadSettings() {
                    StorageService.getItem('presentationSettings').then(function(saved) {
                        if (saved) {
                            currentSettings = angular.extend({}, defaultSettings, saved);
                        }
                        applySettings();
                    }).catch(function(error) {
                        console.warn('Failed to load presentation settings:', error);
                        applySettings();
                    });
                }

                // Apply settings to the presentation
                function applySettings() {
                    // Apply to the main screen container
                    var screenContainer = document.querySelector('.screen-container');
                    if (screenContainer) {
                        // Background mode
                        screenContainer.style.backgroundSize = currentSettings.backgroundMode;
                        
                        // Custom background
                        if (currentSettings.customBackgroundUrl) {
                            screenContainer.style.backgroundImage = 'url("' + currentSettings.customBackgroundUrl + '")';
                        } else {
                            // Use default optimized background
                            screenContainer.style.backgroundImage = '';
                        }
                        

                    }

                    console.log('🎨 Presentation settings applied:', currentSettings);
                }

                // Listen for settings changes from admin
                $rootScope.$on('presentationSettingsChanged', function(event, newSettings) {
                    if (newSettings) {
                        currentSettings = angular.extend({}, defaultSettings, newSettings);
                        $timeout(applySettings, 100); // Small delay to ensure DOM is ready
                    }
                });

                // Listen for storage changes (if settings are changed in another window)
                if (StorageService.onChange) {
                    StorageService.onChange(function(e) {
                        if (e.key === 'presentationSettings') {
                            try {
                                var newSettings = JSON.parse(e.newValue);
                                if (newSettings) {
                                    currentSettings = angular.extend({}, defaultSettings, newSettings);
                                    applySettings();
                                }
                            } catch (error) {
                                console.warn('Failed to parse updated presentation settings:', error);
                            }
                        }
                    });
                }

                // Initial load
                loadSettings();

                // Re-apply settings when screen changes (ensures settings persist across different screens)
                scope.$on('$routeChangeSuccess', function() {
                    $timeout(applySettings, 500);
                });

                // Watch for presentation screen changes
                scope.$watch('presentation.screen', function(newScreen, oldScreen) {
                    if (newScreen !== oldScreen) {
                        $timeout(applySettings, 200);
                    }
                });
            }
        };
    });
})();
