// Enabling Bootstrap Datepickers for date inputs
angularApp.directive('selectPicker', function ($timeout) {
  return {
    restrict: 'A',
    scope: {
      field: '='
    },
    link: function ($scope, $element, attrs) {

      var default_array = [];

      if ($scope.field && $scope.field.model) {
        // If returning to an already populated select list field, load selections
        default_array = $scope.field.model.value;

      } else if ($scope.field && $scope.field.default_option) {
        // If default select options have been set for an empty field
        var default_options = $scope.field.default_option;

        for (var property in default_options) {
          if (default_options.hasOwnProperty(property)) {
            // Push into array that is set via $element.selectpicker 'val' method
            default_array.push(property);
          }
        }
        $scope.field.model = $scope.field.model || {};
        $scope.field.model['value'] = default_array;
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