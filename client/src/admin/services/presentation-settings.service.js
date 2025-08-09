/**
 * Presentation Settings Service
 * Manages settings for presentation window appearance
 */

(function() {
    'use strict';

    angular.module('psadmin').service('PresentationSettingsService', function(StorageService, $rootScope) {
        var self = this;
        
        // Default settings
        var defaultSettings = {
            backgroundMode: 'cover',        // 'cover' or 'contain'
            customBackgroundUrl: null,     // path to custom background
            customBackgroundName: null     // filename for display
        };

        // Current settings (initialized with defaults)
        self.settings = angular.copy(defaultSettings);

        /**
         * Initialize settings from storage
         */
        self.init = function() {
            return StorageService.getItem('presentationSettings').then(function(saved) {
                if (saved) {
                    // Merge saved settings with defaults (in case new settings were added)
                    self.settings = angular.extend({}, defaultSettings, saved);
                } else {
                    self.settings = angular.copy(defaultSettings);
                }
                self.applySettings();
                return self.settings;
            }).catch(function(error) {
                console.warn('Failed to load presentation settings, using defaults:', error);
                self.settings = angular.copy(defaultSettings);
                self.applySettings();
                return self.settings;
            });
        };

        /**
         * Save settings to storage
         */
        self.saveSettings = function() {
            return StorageService.setItem('presentationSettings', self.settings).then(function() {
                self.applySettings();
                console.log('✅ Presentation settings saved');
                return self.settings;
            }).catch(function(error) {
                console.error('❌ Failed to save presentation settings:', error);
                throw error;
            });
        };

        /**
         * Reset settings to defaults
         */
        self.resetToDefaults = function() {
            self.settings = angular.copy(defaultSettings);
            return self.saveSettings();
        };

        /**
         * Update background mode setting
         */
        self.setBackgroundMode = function(mode) {
            if (mode === 'cover' || mode === 'contain') {
                self.settings.backgroundMode = mode;
                return self.saveSettings();
            } else {
                throw new Error('Invalid background mode. Must be "cover" or "contain"');
            }
        };



        /**
         * Set custom background image
         */
        self.setCustomBackground = function(imageUrl, filename) {
            self.settings.customBackgroundUrl = imageUrl;
            self.settings.customBackgroundName = filename;
            return self.saveSettings();
        };

        /**
         * Remove custom background (revert to default)
         */
        self.removeCustomBackground = function() {
            self.settings.customBackgroundUrl = null;
            self.settings.customBackgroundName = null;
            return self.saveSettings();
        };

        /**
         * Validate image file
         */
        self.validateImageFile = function(file) {
            return new Promise(function(resolve, reject) {
                // Check file type
                var allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
                if (allowedTypes.indexOf(file.type) === -1) {
                    reject(new Error('Invalid file type. Please upload PNG, JPEG, or WebP images only.'));
                    return;
                }

                // Check file size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    reject(new Error('File too large. Maximum size is 10MB.'));
                    return;
                }

                // Check image dimensions
                var img = new Image();
                img.onload = function() {
                    if (img.width < 1920 || img.height < 1080) {
                        reject(new Error('Image too small. Minimum dimensions: 1920×1080 pixels. Your image: ' + img.width + '×' + img.height));
                        return;
                    }
                    resolve({
                        width: img.width,
                        height: img.height,
                        valid: true
                    });
                };
                img.onerror = function() {
                    reject(new Error('Invalid image file or corrupted.'));
                };
                img.src = URL.createObjectURL(file);
            });
        };

        /**
         * Apply current settings to the presentation window
         */
        self.applySettings = function() {
            // Broadcast settings change to update presentation
            $rootScope.$broadcast('presentationSettingsChanged', self.settings);
            
            // Inject CSS dynamically
            self.injectPresentationCSS();
        };

        /**
         * Inject CSS for presentation settings
         */
        self.injectPresentationCSS = function() {
            // Remove existing dynamic styles
            var existingStyle = document.getElementById('presentation-dynamic-styles');
            if (existingStyle) {
                existingStyle.remove();
            }

            // Create new style element
            var style = document.createElement('style');
            style.id = 'presentation-dynamic-styles';
            style.type = 'text/css';

            var css = '';

            // Background mode
            css += '.screen-container { ';
            css += 'background-size: ' + self.settings.backgroundMode + ' !important; ';
            
            // Custom background
            if (self.settings.customBackgroundUrl) {
                css += 'background-image: url("' + self.settings.customBackgroundUrl + '") !important; ';
            }
            
            // Bottom margin
            if (self.settings.bottomMargin > 0) {
                css += 'padding-bottom: ' + self.settings.bottomMargin + 'px !important; ';
            }
            
            css += '}';

            style.innerHTML = css;
            document.head.appendChild(style);

            console.log('🎨 Applied presentation settings:', self.settings);
        };

        /**
         * Get current settings
         */
        self.getSettings = function() {
            return self.settings;
        };

        // Initialize on service creation
        self.init();
    });
})();
