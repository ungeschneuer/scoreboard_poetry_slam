/**
 * Presentation Application Entry Point  
 * Loads only presentation-specific modules and dependencies
 */

// Import vendor dependencies specific to presentation
import '../css/vendor-presentation.css';

// Import AngularJS and minimal dependencies for presentation
import angular from 'angular';
import 'angular-animate';

// Import presentation-specific styles
import './css/presentation.css';

// Import shared services (minimal set)
import '../services/sync.service.js';
import '../services/storage.service.js';

// Import presentation application
import './js/presentation-app.js';

// Import presentation components
import './components/intro.component.js';
import './components/group.component.js';
import './components/custom-text.component.js';
import './components/participant.component.js';
import './components/group-ratings.component.js';
import './components/competition-ratings.component.js';
import './components/rating-participant.component.js';

// Import presentation directives
import './directives/background-video.directive.js';
import './directives/clip.directive.js';
import './directives/odometer.directive.js';

// Import presentation filters (minimal set)
import '../filters/entry-of-id.filter.js';

console.log('🎬 Presentation application entry point loaded');

// Bootstrap presentation application when DOM is ready
angular.element(document).ready(function() {
  angular.bootstrap(document, ['ps']);
  console.log('🚀 Presentation application bootstrapped');
});
