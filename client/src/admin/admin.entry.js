/**
 * Admin Application Entry Point
 * Loads only admin-specific modules and dependencies
 */

// Import vendor dependencies specific to admin
import '../css/vendor-admin.css';

// Import AngularJS and core dependencies
import angular from 'angular';
import 'angular-route';
import 'angular-material';
import 'angular-animate';
import 'angular-messages';
import 'ng-sortable';
import 'angular-file-saver';
import 'ng-file-upload';
import 'md-data-table';

// Import admin-specific styles
import './css/admin.css';
import './css/presentation-settings.css';

// Import shared services
import '../services/sync.service.js';
import '../services/storage.service.js';
import '../services/file.service.js';

// Import admin application and modules
import './js/admin-app.js';

// Import admin controllers
import './controllers/simple-list.controller.js';
import './controllers/group-participants.controller.js';
import './controllers/presentation.controller.js';
import './controllers/about.controller.js';
import './controllers/administration-interface.controller.js';
import './controllers/video-admin.controller.js';
import './controllers/sound-admin.controller.js';

// Import admin services
import './services/dialog.service.js';
import './services/entity-utils.service.js';
import './services/presentation.service.js';
import './services/csv-export.service.js';
import './services/presentation-settings.service.js';

// Import admin directives
import './directives/delete-button.directive.js';
import './directives/sidenav-entry.directive.js';
import './directives/download-local-storage.directive.js';
import './directives/upload-local-storage.directive.js';
import './directives/csv-export.directive.js';
import './directives/sound-pad.directive.js';
import './directives/media-panel.directive.js';
import './directives/provide-participant.directive.js';
import './directives/competitions-tab.directive.js';
import './directives/groups-tab.directive.js';
import './directives/participants-tab.directive.js';
import './directives/results-tab.directive.js';
import './directives/end-tab.directive.js';
import './directives/offer-presentation-window.directive.js';
import './directives/background-audio.directive.js';
import './directives/audio-shortcuts.directive.js';

// Import admin filters
import '../filters/entry-of-id.filter.js';
import '../filters/participant-of-id.filter.js';

console.log('🔧 Admin application entry point loaded');

// Bootstrap admin application when DOM is ready
angular.element(document).ready(function() {
  angular.bootstrap(document, ['psadmin']);
  console.log('🚀 Admin application bootstrapped');
});
