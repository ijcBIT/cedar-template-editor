'use strict';

define([
  'angular',
  'cedar/template-editor/control-term/cedar-child-tree.directive',
  'cedar/template-editor/control-term/cedar-class-tree.directive',
  'cedar/template-editor/control-term/cedar-control-term.directive',
  'cedar/template-editor/control-term/cedar-control-term-ontology-picker.directive',
  'cedar/template-editor/control-term/cedar-control-term-value-set-picker.directive',
  'cedar/template-editor/control-term/cedar-name-of-field.directive',
  'cedar/template-editor/control-term/provisional-class.service',
  'cedar/template-editor/control-term/control-term.service',
  'cedar/template-editor/control-term/control-term-data.service',
  'cedar/template-editor/control-term/html-to-plain-text.filter',
  'cedar/template-editor/control-term/return-null-if-empty.filter',
], function(angular) {
  angular.module('cedar.templateEditor.controlTerm', [
    'cedar.templateEditor.controlTerm.cedarChildTreeDirective',
    'cedar.templateEditor.controlTerm.cedarClassTreeDirective',
    'cedar.templateEditor.controlTerm.cedarControlTermDirective',
    'cedar.templateEditor.controlTerm.cedarControlTermOntologyPickerDirective',
    'cedar.templateEditor.controlTerm.cedarControlTermValueSetPickerDirective',
    'cedar.templateEditor.controlTerm.cedarNameOfFieldDirective',
    'cedar.templateEditor.controlTerm.provisionalClassService',
    'cedar.templateEditor.controlTerm.controlTermService',
    'cedar.templateEditor.controlTerm.controlTermDataService',
    'cedar.templateEditor.controlTerm.htmlToPlainTextFilter',
    'cedar.templateEditor.controlTerm.returnNullIfEmptyFilter',
  ]);
});