'use strict';

define([
  'angular',
  'cedar/template-editor/service/client-side-validation.service',
  'cedar/template-editor/service/data-manipulation.service',
  'cedar/template-editor/service/data-template.service',
  'cedar/template-editor/service/data-util.service',
  'cedar/template-editor/service/field-type.service',
  'cedar/template-editor/service/staging.service',
  'cedar/template-editor/service/template-element.service',
  'cedar/template-editor/service/template-instance.service',
  'cedar/template-editor/service/template.service',
  'cedar/template-editor/service/url.service',
  'cedar/template-editor/service/ui-message.service',
  'cedar/template-editor/service/ui-util.service',
  'cedar/template-editor/service/authorized-backend.service',
  'cedar/template-editor/service/http-builder.service',
  'cedar/template-editor/service/user.service',
  'cedar/template-editor/service/user-data.service',
  'cedar/template-editor/service/rich-text-config.service',
], function(angular) {
  angular.module('cedar.templateEditor.service', [
    'cedar.templateEditor.service.clientSideValidationService',
    'cedar.templateEditor.service.dataManipulationService',
    'cedar.templateEditor.service.dataTemplateService',
    'cedar.templateEditor.service.dataUtilService',
    'cedar.templateEditor.service.fieldTypeService',
    'cedar.templateEditor.service.stagingService',
    'cedar.templateEditor.service.templateElementService',
    'cedar.templateEditor.service.templateInstanceService',
    'cedar.templateEditor.service.templateService',
    'cedar.templateEditor.service.urlService',
    'cedar.templateEditor.service.uIMessageService',
    'cedar.templateEditor.service.uIUtilService',
    'cedar.templateEditor.service.authorizedBackendService',
    'cedar.templateEditor.service.httpBuilderService',
    'cedar.templateEditor.service.userService',
    'cedar.templateEditor.service.userDataService',
    'cedar.templateEditor.service.richTextConfigService',
  ]);
});