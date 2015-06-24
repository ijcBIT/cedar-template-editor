// Enabling Bootstrap Datepickers for date inputs
angularApp.directive('selectPicker', function ($timeout) {
  return {
    restrict: 'A',
    scope: {
      defaults: '='
    },
    link: function ($scope, $element, attrs) {

      var default_array = [];

      // If default select options have been set
      if ($scope.defaults) {
        var default_options = $scope.defaults;

        for (var property in default_options) {
          if (default_options.hasOwnProperty(property)) {
            // Push into array that is set via $element.selectpicker 'val' method
            default_array.push(property);
          }
        }
      }

      $timeout(function() {
        $element.selectpicker({
          style: 'btn-select-picker',
          iconBase: 'fa',
          tickIcon: 'fa-check',
        });
        $element.selectpicker('val', default_array);
      }, 25);
    }
  };
});