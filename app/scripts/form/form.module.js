'use strict';

define([
  'angular',
  'cedar/template-editor/controlled-term/controlled-term.module',
  'cedar/template-editor/form/added-field-item.directive',
  'cedar/template-editor/form/date-time-picker.directive',
  'cedar/template-editor/form/field.directive',
  'cedar/template-editor/form/form.directive',
  'cedar/template-editor/form/select-picker.directive',
  'cedar/template-editor/form/spreadsheet.service',
  'cedar/template-editor/form/spreadsheet/tooltip.service',
  'cedar/template-editor/form/spreadsheet/extendedAutocompleteEditor.service',  
  'cedar/template-editor/form/with-floating-label.directive',
  'cedar/template-editor/form/no-image.directive',
  'cedar/template-editor/form/right-click.directive',
  'cedar/template-editor/form/cedar-runtime-field.directive',
  'cedar/template-editor/modal/cedar-finder.directive',
  'cedar/template-editor/modal/cedar-terms-modal.directive',
  'cedar/template-editor/form/auto-focus.directive',
  'cedar/template-editor/form/constrained-value.directive',
  'cedar/template-editor/form/constrained-default.directive',
  'cedar/template-editor/form/recommended-value.directive',
  'cedar/template-editor/form/cedar-pager.directive',
  'cedar/template-editor/form/field-toolbar.directive',
  'cedar/template-editor/search-browse/cedar-infinite-scroll.directive',
  'cedar/template-editor/search-browse/cedar-modal-show.directive',
  'cedar/template-editor/form/field-create/cardinality-selector.directive',
  'cedar/template-editor/form/date-validation.directive'


], function(angular) {
  angular.module('cedar.templateEditor.form', [
    'cedar.templateEditor.controlledTerm',
    'cedar.templateEditor.form.addedFieldItemDirective',
    'cedar.templateEditor.form.dateTimePickerDirective',
    'cedar.templateEditor.form.fieldDirective',
    'cedar.templateEditor.form.formDirective',
    'cedar.templateEditor.form.selectPickerDirective',
    'cedar.templateEditor.form.spreadsheetService',
    'cedar.templateEditor.form.spreadsheet.tooltipService',
    'cedar.templateEditor.form.spreadsheet.extendedAutocompleteEditor',
    'cedar.templateEditor.form.withFloatingLabelDirective',
    'cedar.templateEditor.form.noImageDirective',
    'cedar.templateEditor.form.rightClickDirective',
    'cedar.templateEditor.form.cedarRuntimeField',
    'cedar.templateEditor.modal.cedarFinderDirective',
    'cedar.templateEditor.modal.cedarTermsModalDirective',
    'cedar.templateEditor.form.autoFocusDirective',
    'cedar.templateEditor.form.constrainedValue',
    'cedar.templateEditor.form.constrainedDefault',
    'cedar.templateEditor.form.recommendedValue',
    'cedar.templateEditor.form.cedarPager',
    'cedar.templateEditor.form.fieldToolbar',
    'cedar.templateEditor.searchBrowse.cedarInfiniteScrollDirective',
    'cedar.templateEditor.searchBrowse.cedarModalShowDirective',
    'cedar.templateEditor.form.fieldCreate.cardinalitySelector',
    'cedar.templateEditor.form.dateValidation'


  ]);
});