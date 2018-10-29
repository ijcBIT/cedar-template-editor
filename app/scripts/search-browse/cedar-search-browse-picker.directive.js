'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user',
    ], function (angular) {
      angular.module('cedar.templateEditor.searchBrowse.cedarSearchBrowsePickerDirective', [
        'cedar.templateEditor.service.cedarUser'
      ]).directive('cedarSearchBrowsePicker', cedarSearchBrowsePickerDirective);

      cedarSearchBrowsePickerDirective.$inject = ['CedarUser', 'DataManipulationService', 'UIUtilService'];

      function cedarSearchBrowsePickerDirective(CedarUser, DataManipulationService, UIUtilService) {

        var directive = {
          bindToController: {
            selectResourceCallback: '=',
            pickResourceCallback  : '=',
            mode                  : '='
          },
          controller      : cedarSearchBrowsePickerController,
          controllerAs    : 'dc',
          restrict        : 'E',
          scope           : {},
          templateUrl     : 'scripts/search-browse/cedar-search-browse-picker.directive.html'
        };

        return directive;

        cedarSearchBrowsePickerController.$inject = [
          '$location',
          '$timeout',
          '$scope',
          '$rootScope',
          '$window',
          '$translate',
          'CedarUser',
          'resourceService',
          'UIMessageService',
          'UISettingsService',
          'QueryParamUtilsService',
          'AuthorizedBackendService',
          'FrontendUrlService',
          'UIProgressService',
          'CONST',
          'MessagingService'
        ];

        function cedarSearchBrowsePickerController($location, $timeout, $scope, $rootScope, $window, $translate, CedarUser,
                                                   resourceService,
                                                   UIMessageService, UISettingsService, QueryParamUtilsService,
                                                   AuthorizedBackendService,
                                                   FrontendUrlService,
                                                   UIProgressService, CONST, MessagingService) {
          var vm = this;

          vm.breadcrumbName = breadcrumbName;
          vm.currentPath = "";
          vm.currentFolderId = "";
          vm.offset = 0;
          vm.nextOffset = null;
          vm.requestLimit = UISettingsService.getRequestLimit();

          vm.totalCount = null;
          vm.deleteResource = deleteResource;
          vm.doSearch = doSearch;
          vm.editResource = editResource;
          vm.facets = {};
          vm.forms = [];
          vm.activeTab = 'resource-info';


          // modals
          vm.showMoveModal = showMoveModal;
          vm.showPublishModal = showPublishModal;
          vm.showCopyModal = showCopyModal;
          vm.showShareModal = showShareModal;
          vm.showRenameModal = showRenameModal;
          vm.showNewFolderModal = showNewFolderModal;
          vm.showFlowModal = showFlowModal;
          vm.copyModalVisible = false;
          vm.moveModalVisible = false;
          vm.publishModalVisible = false;
          vm.shareModalVisible = false;
          vm.renameModalVisible = false;
          vm.newFolderModalVisible = false;
          vm.flowModalVisible = false;


          vm.getFacets = getFacets;
          vm.getForms = getForms;
          vm.getCurrentFolderSummary = getCurrentFolderSummary;
          vm.getFolderContentsById = getFolderContentsById;
          vm.getSelectedNode = getSelectedNode;
          vm.getResourceIconClass = getResourceIconClass;
          vm.getResourceTypeClass = getResourceTypeClass;
          vm.canBeVersioned = canBeVersioned;
          vm.goToResource = goToResource;
          vm.goToFolder = goToFolder;
          vm.isResourceTypeActive = isResourceTypeActive;
          vm.isSearching = false;
          vm.launchInstance = launchInstance;
          vm.copyToWorkspace = copyToWorkspace;
          vm.copyResource = copyResource;
          vm.publishResource = publishResource;
          vm.createDraftResource = createDraftResource;
          vm.isSelected = isSelected;


          vm.onDashboard = onDashboard;
          vm.narrowContent = narrowContent;
          vm.pathInfo = [];
          vm.params = $location.search();
          vm.hash = $location.hash();
          vm.resources = [];
          vm.canNotSubmit = true;
          vm.canNotWrite = false;
          vm.canNotShare = false;
          vm.canNotPopulate = false;
          vm.canNotPublish = false;
          vm.canNotCreateDraft = false;
          vm.canNotDelete = false;
          vm.canNotRename = false;
          vm.currentFolder = null;

          vm.hasSelected = hasSelected;
          vm.getSelected = getSelected;
          vm.getSelectedVersions = getSelectedVersions;
          vm.hasUnreadMessages = hasUnreadMessages;
          vm.getUnreadMessageCount = getUnreadMessageCount;
          vm.openMessaging = openMessaging;
          vm.isPublished = isPublished;

          vm.showFilters = true;
          vm.filterShowing = filterShowing;
          vm.resetFilters = resetFilters;
          vm.resetFiltersEnabled = resetFiltersEnabled;
          vm.filterSections = {};
          vm.isFilterSection = isFilterSection;

          vm.getArrowIcon = getArrowIcon;
          vm.showFloatingMenu = false;

          vm.showOrHide = showOrHide;
          vm.toggleFavorites = toggleFavorites;
          vm.toggleFilters = toggleFilters;
          vm.workspaceClass = workspaceClass;
          vm.composeOpen;

          //
          // publication
          //
          //vm.canPublishStatic = canPublishStatic;
          //vm.canCreateDraftStatic = canCreateDraftStatic;


          vm.isGridView = isGridView;
          vm.isListView = isListView;
          vm.toggleView = toggleView;

          vm.setSortByName = setSortByName;
          vm.setSortByCreated = setSortByCreated;
          vm.setSortByUpdated = setSortByUpdated;
          vm.updateSort = updateSort;
          vm.isSort = isSort;
          vm.sortName = sortName;
          vm.sortCreated = sortCreated;
          vm.sortUpdated = sortUpdated;

          vm.isInfoOpen = isInfoOpen;
          vm.toggleInfo = toggleInfo;
          vm.isInfoTab = isInfoTab;
          vm.isVersionTab = isVersionTab;

          vm.toggleResourceType = toggleResourceType;

          vm.isTemplate = isTemplate;
          vm.isElement = isElement;
          vm.isFolder = isFolder;
          vm.isMeta = isMeta;
          vm.buildBreadcrumbTitle = buildBreadcrumbTitle;


          vm.editingDescription = false;
          vm.editingDescriptionSelection = null;
          vm.editingDescriptionInitialValue = null;

          vm.isSharedMode = isSharedMode;
          vm.isSearchMode = isSearchMode;
          vm.isHomeMode = isHomeMode;
          vm.nodeListQueryType = null;
          vm.breadcrumbTitle = null;
          vm.forms = null;


          UIUtilService.setTotalMetadata(0);
          UIUtilService.setVisibleMetadata(0);
          UIUtilService.setInstances(null);

          vm.getTotalMetadata = function () {
            return UIUtilService.getTotalMetadata();
          };

          vm.getVisibleMetadata = function () {
            return UIUtilService.getVisibleMetadata();
          };

          vm.getInstances = function () {
            return UIUtilService.getInstances();
          };


          //
          //  Publication  start
          //


          vm.filterDraft = function () {
            return (vm.getFilterStatus() == CONST.publication.DRAFT) || (vm.getFilterStatus() == CONST.publication.ALL);
          };

          vm.filterPublished = function () {
            return (vm.getFilterStatus() == CONST.publication.PUBLISHED) || (vm.getFilterStatus() == CONST.publication.ALL);
          };

          vm.filterBoth = function () {
            return (vm.getFilterStatus() == CONST.publication.ALL);
          };

          vm.filterLatest = function () {
            return (vm.getFilterVersion() == CONST.publication.LATEST);
          };

          vm.filterAll = function () {
            return (vm.getFilterVersion() == CONST.publication.ALL);
          };


          vm.setPublicationStatus = function (value) {
            vm.setResourcePublicationStatus(value);
          };

          vm.setPublicationVersion = function (value) {
            vm.setResourceVersion(value);
          };

          vm.setFilterBoth = function () {
            vm.setResourcePublicationStatus(CONST.publication.ALL);
          };


          vm.setFilterPublished = function () {
            vm.setResourcePublicationStatus(CONST.publication.PUBLISHED);
          };

          vm.setFilterDraft = function () {
            vm.setResourcePublicationStatus(CONST.publication.DRAFT);
          };

          vm.toggleFilterPublished = function () {
            if (vm.filterPublished()) {
              vm.setResourcePublicationStatus(CONST.publication.DRAFT);
            } else {
              vm.setResourcePublicationStatus(CONST.publication.PUBLISHED);
            }
          };

          vm.toggleFilterDraft = function () {
            if (vm.filterDraft()) {
              vm.setResourcePublicationStatus(CONST.publication.PUBLISHED);
            } else {
              vm.setResourcePublicationStatus(CONST.publication.DRAFT);
            }
          };

          vm.getFilterVersion = function () {
            return CedarUser.getVersion();
          };

          vm.getFilterStatus = function () {
            return CedarUser.getStatus();
          };

          vm.getDraftIcon = function () {
            return 'fa-unlock';
          };

          vm.getBothIcon = function () {
            return 'fa-check-circle';
          };

          vm.getAllIcon = function () {
            return 'fa-check-circle';
          };

          vm.getPublishedIcon = function () {
            return 'fa-globe';
          };

          vm.getLatestIcon = function () {
            return 'fa-check-circle';
          };

          vm.getVersionIcon = function (value) {
            switch (value) {
              case CONST.publication.DRAFT:
                return vm.getDraftIcon();
                break;
              case CONST.publication.PUBLISHED:
                return vm.getPublishedIcon();
                break;
              case CONST.publication.LATEST:
                return vm.getLatestIcon();
                break;
            }
          };

          vm.setFilterLatest = function () {
            vm.setResourceVersion(CONST.publication.LATEST);
          };

          vm.setFilterAll = function () {
            vm.setResourceVersion(CONST.publication.ALL);
          };

          vm.toggleFilterLatest = function () {
            if (vm.getFilterVersion() == CONST.publication.LATEST) {
              vm.setResourceVersion(CONST.publication.ALL);
            } else {
              vm.setResourceVersion(CONST.publication.LATEST);
            }
          };

          vm.setResourcePublicationStatus = function (value) {
            CedarUser.setStatus(value);
            UISettingsService.saveStatus(value);
            init();
          };

          vm.setResourceVersion = function (value) {
            CedarUser.setVersion(value);
            UISettingsService.saveVersion(value);
            init();
          };

          //
          //  publication end
          //

          vm.titleLocation = function () {
            return DataManipulationService.titleLocation();
          };

          vm.descriptionLocation = function () {
            return DataManipulationService.descriptionLocation();
          };

          vm.getTitle = function (node) {
            if (node) {
              return DataManipulationService.getTitle(node);
            }
          };

          vm.getDescription = function (node) {
            if (node) {
              return DataManipulationService.getDescription(node);
            }
          };

          vm.hasIdentifier = function (node) {
            if (node) {
              return node.hasOwnProperty(CONST.model.IDENTIFIER) && node[CONST.model.IDENTIFIER];
            }
          };

          vm.getIdentifier = function (node) {
            if (node) {
              return node[CONST.model.IDENTIFIER];
            }
          };

          vm.getId = function (node, label) {
            if (node) {
              var id = DataManipulationService.getId(node);
              return id.substr(id.lastIndexOf('/') + 1) + label;
              //return id + label;
            }
          };

          vm.isOverflow = function (node, label) {
            var id = '#' + vm.getId(node, label) + ' .title-text';
            var elm = jQuery(id);
            return (elm[0].scrollWidth > elm.innerWidth());
          };

          vm.hideModal = function (visible) {
            visible = false;
          };

          vm.cancelDescriptionEditing = function () {
          };

          // adjust the position of the context menu
          vm.toggledCedarDropdownMenu = function ($event, resource, view) {

            var centerPanel = document.getElementById('workspace-view-container');
            var row = document.getElementById(vm.getId(resource, 'row'));
            var menu = document.getElementById(vm.getId(resource, 'menu'));
            var offsetX = 200;
            var offsetY = 30;

            if (centerPanel && row && menu) {

              var centerScrollTop = centerPanel.scrollTop;
              var centerRect = centerPanel.getBoundingClientRect();
              var rowRect = row.getBoundingClientRect();

              // position the menu at the button that opened it
              if (view == 'list') {
                // make an adjustment
                menu.style.setProperty("left", (rowRect.width - offsetX - 20) + "px");
                menu.style.setProperty("top", (rowRect.top - centerRect.top + offsetY + centerScrollTop) + "px");
              } else {
                // open to the left if it would be hidden on the right
                var offsetXMod = (rowRect.right + offsetX > centerRect.right) ? rowRect.width : 0;
                menu.style.setProperty("left", (rowRect.width - offsetXMod - 20) + "px");
                menu.style.setProperty("top", offsetY + "px");
              }

            }
          };

          vm.toggleDescriptionEditing = function () {
            if (vm.getSelected()) {
              vm.editingDescription = !vm.editingDescription;

              if (vm.editingDescription) {
                vm.editingDescriptionSelection = vm.getSelected();
                vm.editingDescriptionInitialValue = getSelected()[CONST.model.DESCRIPTION];

                $timeout(function () {
                  var jqDescriptionField = $('#edit-description');
                  if (jqDescriptionField) {
                    jqDescriptionField.focus();
                    if (jqDescriptionField.val()) {
                      var l = jqDescriptionField.val().length;
                      jqDescriptionField[0].setSelectionRange(0, l);
                    }
                  }

                  $window.onclick = function (event) {
                    // make sure we are hitting something else
                    if (event.target.id != 'edit-description') {
                      vm.editingDescription = false;

                      var jqDescriptionField = $('#edit-description');
                      if (jqDescriptionField) {
                        jqDescriptionField.blur();
                      }
                      if (vm.editingDescriptionInitialValue != vm.editingDescriptionSelection[CONST.model.DESCRIPTION]) {
                        vm.updateDescription();
                      }
                      $window.onclick = null;
                      $scope.$apply();
                    }
                  };
                });
              } else {
                $window.onclick = null;
                $scope.$apply();

              }
            }
          };

          function getNextOffset(next) {
            var result = null;
            if (next) {
              var result = [];
              next.split("&").forEach(function(part) {
                var item = part.split("=");
                result[item[0]] = decodeURIComponent(item[1]);
              });
              result = parseInt(result['offset']);
            }
            return result;
          };


          vm.selectResource = function (resource, force) {

            if (force || !Object.is(resource, getSelected())) {

              vm.editingDescription = false;
              setSelected(resource);
              vm.setPermissions();

              $timeout(function () {
                //if (infoShowing()) {
                vm.getResourceReport(resource);
                // } else {
                //   vm.getResourceDetails(resource);
                // }

                if (typeof vm.selectResourceCallback === 'function') {
                  vm.selectResourceCallback(resource);
                }
              }, 0);
            }
          };

          // show the info panel with this resource or find one
          vm.showInfoPanel = function () {
            if (vm.isSharedMode()) {
              resetSelected();
            } else if (!hasSelected()) {
              if (vm.currentPath) {
                vm.selectResource(vm.currentPath);
              } else {
                if (vm.folder) {
                  vm.selectResource(vm.folder);
                }
              }
            }

            //vm.setResourceInfoVisibility(true);
          };

          vm.isResourceSelected = function (resource) {
            if (resource == null || !hasSelected()) {
              return false;
            } else {
              return getSelected()['@id'] == resource['@id'];
            }
          };

          vm.canSubmit = function () {
            return hasSelected() && resourceService.canSubmit(getSelected());
          };

          vm.getNumberOfInstances = function () {
            if (hasSelected() && getSelected()[CONST.model.NUMBEROFINSTANCES]) {
              var value = getSelected()[CONST.model.NUMBEROFINSTANCES];
              UIUtilService.setTotalMetadata(value);
              return value;
            }
          };

          vm.getDerivedFrom = function () {
            if (hasSelected() && getSelected().derivedFrom) {
              return getSelected().derivedFrom;
            }
          };

          vm.getBasedOn = function () {
            if (getSelected() && getSelected().isBasedOn) {
              return getSelected().isBasedOn;
            }
          };

          vm.doSearchTemplateInstances = function (id) {

            var limit = 100;
            var offset = 0;
            var sort = 'name';

            resourceService.hasMetadata(
                id,
                {sort: sort, limit: limit, offset: offset},
                function (response) {
                  UIUtilService.setVisibleMetadata(response.totalCount);
                  UIUtilService.setInstances(response.resources);
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                }
            );
          };


          // toggle the info panel with this resource or find one
          vm.toggleDirection = function () {
            return (infoShowing() ? 'Hide' : 'Show') + ' details';
          };

          vm.setPermissions = function () {
            vm.canNotWrite = !vm.canWrite();
            vm.canNotSubmit = !vm.canSubmit();
            vm.canNotShare = !vm.canShare();
            vm.canNotPublish = !vm.canPublish();
            vm.canNotDelete = !vm.canDelete();
            vm.canNotRename = !vm.canRename();
            vm.canNotPopulate = !vm.canPopulate();
            vm.canNotCreateDraft = !vm.canCreateDraft();
            vm.getNumberOfInstances();
            vm.getResourcePublicationStatus();
          };

          vm.getResourceReport = function (resource) {

            if (!resource && vm.hasSelected()) {
              resource = vm.getSelected();
            }
            var id = resource['@id'];
            resourceService.getResourceReport(
                resource,
                function (response) {

                  if (!hasSelected() || (getSelected()['@id'] != response['@id'])) {
                    setSelected(response);

                  } else {
                    for (var prop in response) {
                      getSelected()[prop] = response[prop];

                    }
                  }
                  vm.setPermissions();
                  UIUtilService.setTotalMetadata(response.numberOfInstances);

                  if (vm.isTemplate(resource)) {
                    vm.doSearchTemplateInstances(id);
                  }
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.' + resource.nodeType.toUpperCase() + '.load.error', error);
                }
            );
          };


          vm.getResourceDetails = function (resource) {
            if (!resource && vm.hasSelected()) {
              resource = vm.getSelected();
            }
            var id = resource['@id'];
            resourceService.getResourceDetail(
                resource,
                function (response) {
                  if (!hasSelected() || (getSelected()['@id'] != response['@id'])) {
                    setSelected(response);
                  } else {
                    for (var prop in response) {
                      getSelected()[prop] = response[prop];
                    }
                  }

                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.' + resource.nodeType.toUpperCase() + '.load.error', error);
                }
            );
          };

          vm.canRead = function () {
            return resourceService.canRead(vm.getSelectedNode());
          };

          vm.canWrite = function () {
            return resourceService.canWrite(vm.getSelectedNode());
          };

          vm.canRename = function () {
            return resourceService.canWrite(vm.getSelectedNode());
          };

          vm.canDelete = function () {
            return resourceService.canDelete(vm.getSelectedNode());
          };

          vm.canChangeOwner = function () {
            return resourceService.canChangeOwner(vm.getSelectedNode());
          };

          vm.canShare = function () {
            return resourceService.canShare(vm.getSelectedNode());
          };

          vm.canPopulate = function () {
            return resourceService.canPopulate(vm.getSelectedNode());
          };

          vm.canPublish = function () {
            return resourceService.canPublish(vm.getSelectedNode());
          };

          vm.canCreateDraft = function () {
            return resourceService.canCreateDraft(vm.getSelectedNode());
          };

          vm.canWriteToCurrentFolder = function () {
            return resourceService.canWrite(vm.currentFolder);
          };

          vm.getResourceVersion = function (resource) {
            if (resource != null) {
              return resource['pav:version'];
            }
          };

          vm.getNextResourceVersion = function (resource) {
            var currentVersion = vm.getResourceVersion(resource);
            var parts = currentVersion.split(".");
            if (parts.length == 3) {
              parts[2] = parseInt(parts[2]) + 1;
              return parts.join(".");
            }
            return null;
          };

          vm.getResourcePublicationStatus = function (value) {
            var resource = value || vm.getSelected();
            if (resource != null) {
              return resource[CONST.publication.STATUS];
            }
          };

          vm.updateDescription = function () {

            var resource = vm.editingDescriptionSelection;
            if (resource != null) {

              var postData = {};
              var id = resource['@id'];
              var nodeType = resource.nodeType;
              var description = resource[CONST.model.DESCRIPTION];

              if (nodeType == 'instance') {
                AuthorizedBackendService.doCall(
                    resourceService.renameNode(id, null, description),
                    function (response) {
                      UIMessageService.flashSuccess('SERVER.INSTANCE.update.success', null, 'GENERIC.Updated');
                    },
                    function (err) {
                      UIMessageService.showBackendError('SERVER.INSTANCE.update.error', err);
                    }
                );
              } else if (nodeType == 'field') {
                AuthorizedBackendService.doCall(
                    resourceService.renameNode(id, null, description),
                    function (response) {

                      var title = vm.getTitle(response.data);
                      UIMessageService.flashSuccess('SERVER.FIELD.update.success', {"title": title},
                          'GENERIC.Updated');
                    },
                    function (err) {
                      UIMessageService.showBackendError('SERVER.field.update.error', err);
                    }
                );
              } else if (nodeType == 'element') {
                AuthorizedBackendService.doCall(
                    resourceService.renameNode(id, null, description),
                    function (response) {

                      var title = vm.getTitle(response.data);
                      UIMessageService.flashSuccess('SERVER.ELEMENT.update.success', {"title": title},
                          'GENERIC.Updated');
                    },
                    function (err) {
                      UIMessageService.showBackendError('SERVER.ELEMENT.update.error', err);
                    }
                );
              } else if (nodeType == 'template') {
                AuthorizedBackendService.doCall(
                    resourceService.renameNode(id, null, description),
                    function (response) {

                      $scope.form = response.data;
                      var title = vm.getTitle(response.data);
                      UIMessageService.flashSuccess('SERVER.TEMPLATE.update.success',
                          {"title": title}, 'GENERIC.Updated');
                    },
                    function (err) {
                      UIMessageService.showBackendError('SERVER.TEMPLATE.update.error', err);
                    }
                );
              } else if (nodeType == 'folder') {
                AuthorizedBackendService.doCall(
                    resourceService.renameNode(id, null, description),
                    function (response) {
                      UIMessageService.flashSuccess('SERVER.FOLDER.update.success', {"title": getSelected().name},
                          'GENERIC.Updated');
                    },
                    function (response) {
                      UIMessageService.showBackendError('SERVER.FOLDER.update.error', response);

                      // UIMessageService.acknowledgedExecution(
                      //     function () {
                      //       $timeout(function () {
                      //         $rootScope.goToHome();
                      //       });
                      //     },
                      //     'GENERIC.Warning',
                      //     $translate.instant(error.data.message),
                      //     'GENERIC.Ok');

                    }
                );
              }
            }
          };

          // callback to load more resources for the current folder
          vm.loadMore = function () {

            if (activeResourceTypes().length > 0) {

              if (vm.isSearching) {
                vm.searchMore();
              } else {

                // are there more?
                if (vm.nextOffset && !vm.loading && vm.nextOffset < vm.totalCount) {

                  vm.offset = vm.nextOffset;
                  vm.loading = true;
                  return resourceService.getResources(
                      {
                        folderId     : vm.currentFolderId,
                        resourceTypes: activeResourceTypes(),
                        sort         : sortField(),
                        limit        : vm.requestLimit,
                        offset       : vm.offset
                      },
                      function (response) {

                        for (let i = 0; i < response.resources.length; i++) {
                          vm.resources[i + vm.offset] = response.resources[i];
                        }

                        vm.nextOffset = getNextOffset(response.paging.next);
                        vm.totalCount = response.totalCount;
                        vm.loading = false;

                      },
                      function (error) {
                        UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
                        vm.loading = false;
                      }
                  );
                }

              }
            }
          };

          vm.refreshWorkspace = function (resource) {
            vm.params = $location.search();
            vm.hash = $location.hash();
            init();
            if (resource) {
              $scope.selectResourceById(resource['@id']);
            }
          };


          // callback to load more resources for the current folder
          vm.searchMore = function () {

            if (activeResourceTypes().length > 0) {

              // are there more?
              if (vm.nextOffset && !vm.loading) {

                vm.offset = vm.nextOffset;
                vm.loading = true;
                return resourceService.searchResources(vm.searchTerm,
                    {
                      resourceTypes: activeResourceTypes(),
                      sort         : sortField(),
                      limit        : vm.requestLimit,
                      offset       : vm.offset
                    },
                    function (response) {


                      for (let i = 0; i < response.resources.length; i++) {
                        vm.resources[i + vm.offset] = response.resources[i];
                      }
                      vm.totalCount = response.totalCount;
                      vm.nextOffset = getNextOffset(response.paging.next);
                      vm.loading = false;
                    },
                    function (error) {
                      UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                      vm.loading = false;
                    }
                );
              }
            }
          };


          //*********** ENTRY POINT

          getPreferences();
          CedarUser.setStatus(CONST.publication.ALL);
          UISettingsService.saveStatus(CONST.publication.ALL);
          init();


          function getPreferences() {
            var uip = CedarUser.getUIPreferences();

            vm.resourceTypes = {
              element : uip.resourceTypeFilters.element,
              field   : uip.resourceTypeFilters.field,
              instance: uip.resourceTypeFilters.instance,
              template: uip.resourceTypeFilters.template
            };
            vm.filterSections = {
              type   : true,
              version: false
            };
          }

          function init() {
            vm.isSearching = false;
            if (vm.params.sharing) {
              if (vm.params.sharing == 'shared-with-me') {
                vm.isSearching = true;
                if (vm.showFavorites) {
                  vm.showFavorites = false;
                  updateFavorites();
                }
                // TODO: DO WE NEED THIS??
                getFacets();
                doSharedWithMe();
              }
            } else if (vm.params.search) {
              vm.isSearching = true;
              if (vm.showFavorites) {
                vm.showFavorites = false;
                updateFavorites();
              }
              getFacets();
              doSearch(vm.params.search);
            } else if (vm.params.folderId) {
              resetSelected();
              getFacets();
              var currentFolderId = decodeURIComponent(vm.params.folderId);
              getFolderContentsById(currentFolderId, vm.hash);
              getCurrentFolderSummary(currentFolderId);
            } else {
              //goToFolder(CedarUser.getHomeFolderId());
              goToHomeFolder(vm.hash);
            }
            if (vm.showFavorites) {
              getForms();
            }
            updateFavorites(false);
          }

          function breadcrumbName(folderName) {
            if (folderName == '/') {
              return 'All';
            }
            return folderName;
          }

          function buildBreadcrumbTitle(searchTerm) {
            if (vm.nodeListQueryType == 'view-shared-with-me') {
              return $translate.instant("BreadcrumbTitle.sharedWithMe");
            } else if (vm.nodeListQueryType == 'folder-content') {
              return $translate.instant("BreadcrumbTitle.viewAll");
            } else if (vm.nodeListQueryType == 'search-term') {
              return $translate.instant("BreadcrumbTitle.searchResult", {searchTerm: searchTerm});
            } else {
              return "";
            }
          }

          function isSharedMode() {
            return (vm.nodeListQueryType === 'view-shared-with-me');
          }

          function isSearchMode() {
            return (vm.nodeListQueryType === 'search-term');
          }


          function isHomeMode() {
            return (vm.nodeListQueryType === 'folder-content');
          }

          // wrap with timeout of 1 second for elasticSearch to index anything new
          function doSearch(term) {
            $timeout(function () {
              vm.offset = 0;
              vm.nextOffset = null;
              vm.totalCount = -1;
              vm.loading = true;

              resourceService.searchResources(
                  term,
                  {
                    resourceTypes    : activeResourceTypes(),
                    sort             : sortField(),
                    limit            : vm.requestLimit,
                    offset           : vm.offset,
                    version          : vm.getFilterVersion(),
                    publicationStatus: vm.getFilterStatus()
                  },
                  function (response) {

                    vm.searchTerm = term;
                    vm.isSearching = true;
                    vm.resources = response.resources;
                    vm.nextOffset = getNextOffset(response.paging.next);
                    vm.totalCount = response.totalCount;
                    vm.loading = false;

                    vm.nodeListQueryType = response.nodeListQueryType;
                    vm.breadcrumbTitle = vm.buildBreadcrumbTitle(response.request.q);
                    UIProgressService.complete();
                  },
                  function (error) {
                    UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                    vm.loading = false;
                  }
              );
            }, 1000);
          }

          function doSharedWithMe() {

            vm.offset = 0;
            vm.nextOffset = null;
            vm.totalCount = -1;
            let offset = vm.offset;

            resourceService.sharedWithMeResources(
                {
                  resourceTypes    : activeResourceTypes(),
                  sort             : sortField(),
                  limit            : vm.requestLimit,
                  offset           : vm.offset,
                  version          : vm.getFilterVersion(),
                  publicationStatus: vm.getFilterStatus()
                },
                function (response) {
                  vm.isSearching = true;
                  vm.resources = response.resources;
                  vm.nodeListQueryType = response.nodeListQueryType;
                  vm.breadcrumbTitle = vm.buildBreadcrumbTitle();

                  vm.nextOffset = getNextOffset(response.paging.next);
                  vm.totalCount = response.totalCount;
                  vm.loading = false;

                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                }
            );
          }

          function copyToWorkspace(resource) {
            if (!resource) {
              resource = getSelected();
            }
            var newTitle = $translate.instant('GENERIC.CopyOfTitle', {"title": resource.name});

            resourceService.copyResourceToWorkspace(
                resource, newTitle,
                function (response) {

                  UIMessageService.flashSuccess('SERVER.RESOURCE.copyToWorkspace.success', {"title": resource.name},
                      'GENERIC.Copied');

                  vm.refreshWorkspace(resource);
                },
                function (response) {
                  UIMessageService.showBackendError('SERVER.RESOURCE.copyToWorkspace.error', response);
                }
            );
          }

          function copyResource(resource) {
            if (!resource) {
              resource = getSelected();
            }
            var newTitle = $translate.instant('GENERIC.CopyOfTitle', {"title": resource.name});
            var folderId = vm.currentFolderId;
            if (!folderId) {
              folderId = CedarUser.getHomeFolderId();
            }
            resourceService.copyResource(
                resource, folderId, newTitle,
                function (response) {

                  UIMessageService.flashSuccess('SERVER.RESOURCE.copyResource.success', {"title": resource.name},
                      'GENERIC.Copied');

                  vm.refreshWorkspace(resource);

                },
                function (response) {
                  UIMessageService.showBackendError('SERVER.RESOURCE.copyResource.error', response);
                }
            );
          }

          // set publication status as published
          function publishResource(resource, version) {
            if (!resource) {
              resource = getSelected();
            }
            var newVersion = version || vm.getResourceVersion(resource);
            resourceService.publishResource(
                resource,
                newVersion,
                function (response) {
                  var title = vm.getTitle(resource);
                  UIMessageService.flashSuccess('SERVER.RESOURCE.publishResource.success', {"title": title},
                      'GENERIC.Published');
                  vm.refreshWorkspace(resource);
                },
                function (response) {
                  UIMessageService.showBackendError('SERVER.RESOURCE.publishResource.error', response);
                }
            );
          }

          // set publication status as draft
          function createDraftResource(resource, version) {
            if (!resource) {
              resource = getSelected();
            }
            var folderId = vm.currentFolderId;
            if (!folderId) {
              folderId = CedarUser.getHomeFolderId();
            }
            var newVersion = version || vm.getResourceVersion(resource);
            var propagateSharing = true;
            resourceService.createDraftResource(
                resource,
                folderId,
                newVersion,
                propagateSharing,
                function (response) {
                  var title = vm.getTitle(resource);
                  UIMessageService.flashSuccess('SERVER.RESOURCE.createDraftResource.success', {"title": title},
                      'GENERIC.CreatedDraft');
                  vm.refreshWorkspace(resource);
                },
                function (response) {
                  UIMessageService.showBackendError('SERVER.RESOURCE.createDraftResource.error', response);
                }
            );
          }

          function launchInstance(value) {
            var resource = value || getSelected();
            if (resource) {
              var url = FrontendUrlService.getInstanceCreate(resource['@id'], vm.getFolderId());

              // TODO exceptionally painful for users if we turn this on
              // if (vm.getResourcePublicationStatus(resource)  == CONST.publication.DRAFT) {
              //   UIMessageService.confirmedExecution(
              //       function () {
              //         $location.url(url);
              //       },
              //       'GENERIC.AreYouSure',
              //       'This template is a draft.',
              //       'YES'
              //   );
              // } else {
              //   $location.url(url);
              // }

              $location.url(url);
            }
          }


          function goToResource(value, action) {

            var resource = value || getSelected();
            if (resource) {
              if (resource.nodeType === 'folder') {
                if (action !== 'populate') {
                  goToFolder(resource['@id']);
                }
              } else {
                if (resource.nodeType === 'template' && action === 'populate') {
                  launchInstance(resource);
                } else {
                  editResource(resource);
                }
              }
            }
          }

          function editResource(value) {

            var resource = value || getSelected();
            if (resource) {
              var id = resource['@id'];
              if (typeof vm.pickResourceCallback === 'function') {
                vm.pickResourceCallback(resource);
              }
              switch (resource.nodeType) {
                case CONST.resourceType.TEMPLATE:
                  $location.path(FrontendUrlService.getTemplateEdit(id));
                  break;
                case CONST.resourceType.ELEMENT:
                  if (vm.onDashboard()) {
                    $location.path(FrontendUrlService.getElementEdit(id));
                  }
                  break;
                case CONST.resourceType.INSTANCE:
                  $location.path(FrontendUrlService.getInstanceEdit(id));
                  break;
                case CONST.resourceType.FIELD:
                  $location.path(FrontendUrlService.getFieldEdit(id));
                  break;
                case CONST.resourceType.LINK:
                  $location.path(scope.href);
                  break;
                  //case CONST.resourceType.FOLDER:
                  //  vm.showEditFolder(r);
                  //  break;
              }
            }
          }

          function removeResource(resource) {
            // remove resource from list
            var index = -1;
            for (var i = 0, len = vm.resources.length; i < len; i++) {
              if (vm.resources[i]['@id'] === resource['@id']) {
                index = i;
                break;
              }
            }
            if (index > -1) {
              vm.resources.splice(index, 1);
            }
            // remove current selection
            resetSelected();

            //reset total count
            vm.totalCount--;
          }


          function deleteResource(resource) {
              var r = resource || getSelectedNode();
              if (resourceService.canDelete(r)) {
                UIMessageService.confirmedExecution(
                    function () {
                      resourceService.deleteResource(
                          r,
                          function (response) {

                            UIMessageService.flashSuccess('SERVER.' + r.nodeType.toUpperCase() + '.delete.success',
                                {"title": r.nodeType},
                                'GENERIC.Deleted');
                            removeResource(r);
                          },
                          function (error) {
                            UIMessageService.showBackendError('SERVER.' + r.nodeType.toUpperCase() + '.delete.error',
                                error);
                          }
                      );
                    },
                    'GENERIC.AreYouSure',
                    'DASHBOARD.delete.confirm.' + r.nodeType,
                    'GENERIC.YesDeleteIt'
                );
              }
          }

          function getFacets() {
            resourceService.getFacets(
                function (response) {
                  vm.facets = response.facets;
                },
                function (error) {
                }
            );
          }

          function getForms() {
            return resourceService.searchResources(
                null,
                {resourceTypes: ['template'], sort: '-lastUpdatedOnTS', limit: 4, offset: 0},
                function (response) {
                  vm.forms = response.resources;
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                }
            );
          }




          function getFolderContentsById(folderId, resourceId) {

            if (activeResourceTypes().length > 0) {

              vm.totalCount = -1;
              vm.nextOffset = null;
              vm.loading = true;
              vm.offset = 0;
              vm.loading = true;

              return resourceService.getResources(
                  {
                    folderId         : folderId,
                    resourceTypes    : activeResourceTypes(),
                    sort             : sortField(),
                    limit            : vm.requestLimit,
                    offset           : vm.offset,
                    version          : vm.getFilterVersion(),
                    publicationStatus: vm.getFilterStatus()
                  },
                  function (response) {
                    vm.currentFolderId = folderId;
                    vm.resources = response.resources;
                    vm.pathInfo = response.pathInfo;
                    vm.currentPath = vm.pathInfo.pop();
                    vm.nextOffset = getNextOffset(response.paging.next);
                    vm.totalCount = response.totalCount;
                    vm.loading = false;
                    vm.nodeListQueryType = response.nodeListQueryType;
                    vm.breadcrumbTitle = vm.buildBreadcrumbTitle();
                    if (resourceId) {
                      $scope.selectResourceById(resourceId);
                    }

                  },
                  function (error) {
                    UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
                    vm.loading = false;
                  }
              );
            } else {
              vm.resources = [];
            }
          }

          function getCurrentFolderSummary(folderId) {
            var params = {
              '@id'     : folderId,
              'nodeType': CONST.resourceType.FOLDER
            };
            resourceService.getResourceDetail(
                params,
                function (response) {
                  vm.currentFolder = response;
                },
                function (error) {
                  //UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);

                  UIMessageService.acknowledgedExecution(
                      function () {
                        $timeout(function () {
                          $rootScope.goToHome();
                        });
                      },
                      'GENERIC.Warning',
                      $translate.instant(error.data.message),
                      'GENERIC.Ok');

                }
            );
          }

          function getSelectedNode() {

            var result = null;
            if (!hasSelected() && (vm.isSharedMode() || vm.isSearchMode())) {
              // nothing selected in share or search mode
            } else {
              if (!hasSelected()) {
                result = vm.currentFolder;
              } else {
                result = getSelected();
              }
            }
            return result;
          }

          function isSelected(node) {
            if (hasSelected() && node) {
              return (DataManipulationService.getId(vm.getSelectedNode()) == DataManipulationService.getId(node));
            }
          }

          function getNodeType(resource) {
            return resource ? resource.nodeType : '';
          }

          function getResourceIconClass(resource) {
            var result = "";
            if (resource) {
              result += resource.nodeType + " ";

              switch (resource.nodeType) {
                case CONST.resourceType.FOLDER:
                  result += CONST.resourceIcon.FOLDER;
                  break;
                case CONST.resourceType.TEMPLATE:
                  result += CONST.resourceIcon.TEMPLATE;
                  break;
                case CONST.resourceType.INSTANCE:
                  result += CONST.resourceIcon.INSTANCE;
                  break;
                case CONST.resourceType.ELEMENT:
                  result += CONST.resourceIcon.ELEMENT;
                  break;
                case CONST.resourceType.FIELD:
                  result += CONST.resourceIcon.FIELD;
                  break;
              }
            }
            return result;
          }

          function getResourceTypeClass(resource) {
            var result = '';
            if (resource) {
              switch (resource.nodeType) {
                case CONST.resourceType.FOLDER:
                  result += "folder";
                  break;
                case CONST.resourceType.TEMPLATE:
                  result += "template";
                  break;
                case CONST.resourceType.METADATA:
                  result += "metadata";
                  break;
                case CONST.resourceType.INSTANCE:
                  result += "metadata";
                  break;
                case CONST.resourceType.ELEMENT:
                  result += "element";
                  break;
                case CONST.resourceType.FIELD:
                  result += "field";
                  break;
              }

            }
            return result;
          }

          function canBeVersioned(resource) {
            if (resource) {
              switch (resource.nodeType) {
                case CONST.resourceType.TEMPLATE:
                  return true;
                case CONST.resourceType.ELEMENT:
                  return true;
              }
            }
            return false;
          }

          /*          function canPublishStatic() {
                      return (hasSelected() &&
                          (getSelected().nodeType == CONST.resourceType.TEMPLATE ||
                              getSelected().nodeType == CONST.resourceType.ELEMENT) &&
                          getSelected()[CONST.publication.STATUS] == CONST.publication.DRAFT);
                    }*/

          function isPublished(resource) {
            var result = false;
            if (resource) {
              result = (resource[CONST.publication.STATUS] == CONST.publication.PUBLISHED);
            } else {
              result = (hasSelected() && (getSelected()[CONST.publication.STATUS] == CONST.publication.PUBLISHED));
            }
            return result;
          };

          /*          function canCreateDraftStatic() {
                      return (hasSelected() &&
                          (getSelected().nodeType == CONST.resourceType.TEMPLATE ||
                              getSelected().nodeType == CONST.resourceType.ELEMENT) &&
                          getSelected()[CONST.publication.STATUS] == CONST.publication.PUBLISHED);
                    }*/

          function isTemplate(resource) {
            var result = false;
            if (resource) {
              result = (resource.nodeType == CONST.resourceType.TEMPLATE);
            } else {
              result = (hasSelected() && (getSelected().nodeType == CONST.resourceType.TEMPLATE));
            }
            return result;
          }

          function isElement() {
            return (hasSelected() && (getSelected().nodeType == CONST.resourceType.ELEMENT));
          }

          function isFolder(resource) {
            var result = false;
            if (resource) {
              result = (resource.nodeType == CONST.resourceType.FOLDER);
            } else {
              result = (hasSelected() && (getSelected().nodeType == CONST.resourceType.FOLDER))
            }
            return result;
          }

          function isMeta() {
            return (hasSelected() && (getSelected().nodeType == CONST.resourceType.INSTANCE));
          }

          function goToHomeFolder(resourceId) {
            goToFolder(CedarUser.getHomeFolderId(), resourceId);
          }


          function goToFolder(folderId) {
            vm.currentFolderId = folderId;
            if (vm.onDashboard()) {
              $location.url(FrontendUrlService.getFolderContents(folderId));
            } else {
              vm.params.folderId = folderId;
              resetSelected();
              init();
            }
          }

          function isResourceTypeActive(type) {
            return vm.resourceTypes[type];
          }

          function showOrHide(type) {
            return $translate.instant(isResourceTypeActive(type) ? 'GENERIC.Hide' : 'GENERIC.Show');
          }

          function onDashboard() {
            return vm.mode == 'dashboard';
          }

          function hasUnreadMessages() {
            return MessagingService.unreadCount > 0;
          }

          function getUnreadMessageCount() {
            return Math.min(MessagingService.unreadCount, 9);
          }

          function openMessaging() {
            $location.url(FrontendUrlService.getMessaging(vm.getFolderId()));
          }

          function filterShowing() {
            return vm.showFilters && onDashboard();
          }

          // is something changed by the filters?  for now, just look at the resource types
          function resetFiltersEnabled() {
            var notLatest = vm.getFilterVersion() != CONST.publication.LATEST;
            var notPublishedAndDraft = vm.getFilterStatus() != CONST.publication.ALL;
            var typeHidden = Object.values(vm.resourceTypes).indexOf(false) > -1
            return typeHidden || notLatest || notPublishedAndDraft;
          }

          function resetFilters() {
            var updates = {};
            for (var nodeType in vm.resourceTypes) {
              vm.resourceTypes[nodeType] = true;
              var key = 'resourceTypeFilters.' + nodeType;
              updates[key] = true;
            }
            updates['resourcePublicationStatusFilter.publicationStatus'] = CONST.publication.ALL;
            updates['resourceVersionFilter.version'] = CONST.publication.LATEST;

            UISettingsService.saveUIPreferences(updates);
            init();
          }

          function infoShowing() {
            return CedarUser.isInfoOpen();
          }

          function narrowContent() {
            return vm.showFilters || vm.showResourceInfo || !onDashboard();
          }


          function setInfo(value) {
            CedarUser.setInfo(value);
            UISettingsService.saveInfo(value);
          }


          function toggleFavorites() {
            vm.showFavorites = !vm.showFavorites;
            updateFavorites();
          }

          // toggle the faceted filter panel and the various sections within it
          function toggleFilters(section) {
            if (!section) {
              vm.showFilters = !vm.showFilters;
            } else {
              if (vm.filterSections.hasOwnProperty(section)) {
                vm.filterSections[section] = !vm.filterSections[section];
              }
            }
          }

          function workspaceClass() {
            var width = 12;
            if (vm.onDashboard()) {
              if (vm.showFilters) {
                width = width - 2;
              }
              if (vm.showResourceInfo) {
                width = width - 3;
              }
            }
            return 'col-sm-' + width;
          }


          function getArrowIcon(value) {
            return value ? 'fa-caret-left' : 'fa-caret-down';
          }

          function isFilterSection(section) {
            var result = false;
            if (!section) {
              result = vm.showFilters;
            } else {
              if (vm.filterSections.hasOwnProperty(section)) {
                result = vm.filterSections[section];
              }
            }
            return result;
          }

          function toggleResourceType(type) {
            vm.resourceTypes[type] = !vm.resourceTypes[type];
            CedarUser.toggleResourceType(type);
            UISettingsService.saveResourceType(type, vm.resourceTypes[type]);
            init();
          }


          /**
           * Watch functions.
           */



          $scope.$on('$routeUpdate', function () {
            vm.params = $location.search();
            init();
          });

          $scope.selectResourceById = function (id) {

            if (id) {
              for (var i = 0; i < vm.resources.length; i++) {
                if (id === vm.resources[i]['@id']) {
                  var resource = vm.resources[i];
                  vm.cancelDescriptionEditing();
                  setSelected(resource);
                  vm.setPermissions();
                  //if (infoShowing()) {
                  vm.getResourceReport(resource);
                  // } else {
                  //   vm.getResourceDetails(resource);
                  // }

                  if (typeof vm.selectResourceCallback === 'function') {
                    vm.selectResourceCallback(resource);
                  }
                  break;
                }
              }
            }
          };

          $scope.$on('refreshWorkspace', function (event, args) {
            var selectedResource = args ? args[0] : null;
            vm.refreshWorkspace(selectedResource);
          });

          $scope.hideModal = function (id) {
            jQuery('#' + id).modal('hide');
          };


          /**
           * Private functions.
           */

          function activeResourceTypes() {
            var activeResourceTypes = [];
            angular.forEach(Object.keys(vm.resourceTypes), function (value, key) {
              if (vm.resourceTypes[value]) {
                if (!vm.onDashboard()) {
                  // just elements can be selected
                  if (value == 'element') {
                    activeResourceTypes.push(value);
                  }
                } else {
                  activeResourceTypes.push(value);
                }
              }
            });
            // always want to show folders
            activeResourceTypes.push('folder');
            return activeResourceTypes;
          }

          function resetSelected() {
            UISettingsService.resetSelected();
          }

          function getSelected() {
            return UISettingsService.getSelected();
          }

          function getSelectedVersions() {
            return UISettingsService.getSelected().versions;
          }

          function setSelected(value) {
            UISettingsService.setSelected(value);
          }

          function hasSelected() {
            return UISettingsService.hasSelected();
          }


          function setSortByCreated() {
            UISettingsService.saveSortByCreated(CedarUser.setSortByCreated());
            init();
          }

          function setSortByName() {
            UISettingsService.saveSortByName(CedarUser.setSortByName());
            init();
          }

          function setSortByUpdated() {
            UISettingsService.saveSort(CedarUser.setSortByUpdated());
            init();
          }

          function isSort(value) {
            var result;
            switch (value) {
              case 'name':
                result = CedarUser.isSortByName();
                break;
              case 'createdOnTS':
                result = CedarUser.isSortByCreated();
                break;
              case 'lastUpdatedOnTS':
                result = CedarUser.isSortByUpdated();
                break;
            }
            return result;
          }

          function updateSort(value) {
            switch (value) {
              case 'name':
                setSortByName();
                break;
              case 'createdOnTS':
                setSortByCreated();
                break;
              case 'lastUpdatedOnTS':
                setSortByUpdated();
                break;
            }
          }

          function sortField() {
            return (CedarUser.isSortByName() ? '' : '-') + CedarUser.getSort();
          }

          function sortName() {
            return CedarUser.isSortByName() ? "" : 'invisible';
          }

          function sortCreated() {
            return CedarUser.isSortByCreated() ? "" : 'invisible';
          }

          function sortUpdated() {
            return CedarUser.isSortByUpdated() ? "" : 'invisible';
          }


          function updateFavorites(saveData) {
            $timeout(function () {
              if (vm.showFavorites) {
                angular.element('#favorites').collapse('show');
                getForms();
              } else {
                angular.element('#favorites').collapse('hide');
              }
            });
            if (saveData == null || saveData) {
              UISettingsService.saveUIPreference('populateATemplate.opened', vm.showFavorites);
            }
          }

          function isGridView() {
            return CedarUser.isGridView();
          }

          function isListView() {
            return CedarUser.isListView();
          }

          function toggleView() {
            UISettingsService.saveView(CedarUser.toggleView());
          }

          // is the info panel open or closed
          function isInfoOpen() {
            return CedarUser.isInfoOpen();
          }

          // toggle the state of the info panel
          function toggleInfo() {
            UISettingsService.saveInfo(CedarUser.toggleInfo());
          }

          function isVersionTab() {
            return CedarUser.isVersionTab();
          }

          function isInfoTab() {
            return CedarUser.isInfoTab();
          }

          function toggleInfoTab(tab) {
            UISettingsService.saveInfoTab(CedarUser.toggleInfoTab(tab));
          }

          vm.isTabActive = function (item) {
            return vm.activeTab === item;
          };

          vm.setTab = function (item) {
            vm.activeTab = item;
            if (vm.activeTab == 'resource-version') {
              vm.getResourceReport(vm.getSelectedNode());
              toggleInfoTab('version');
            } else {
              toggleInfoTab('info');
            }
          };


          // open the move modal
          function showCopyModal(resource) {
            let r = resource || getSelected();
            if (r && !vm.isFolder(r)) {
              var homeFolderId = CedarUser.getHomeFolderId();
              var folderId = vm.currentFolderId || homeFolderId;
              vm.copyModalVisible = true;
              $scope.$broadcast('copyModalVisible',
                  [vm.copyModalVisible, r, vm.currentPath, folderId, homeFolderId, vm.resourceTypes, CedarUser.getSort()]);
            }
          }

          // open the move modal
          function showMoveModal() {
            let r = getSelected();
            if (r && resourceService.canWrite(r)) {
              vm.moveModalVisible = true;
              var homeFolderId = CedarUser.getHomeFolderId();
              $scope.$broadcast('moveModalVisible',
                  [vm.moveModalVisible, r, vm.currentPath, vm.currentFolderId, homeFolderId,
                   vm.resourceTypes,
                   CedarUser.getSort()]);
            }
          }

          // open the publish modal
          function showPublishModal(callback, action) {
            let r = getSelected();
            if (r && resourceService.canWrite(r)) {
              vm.publishModalVisible = true;
              var homeFolderId = CedarUser.getHomeFolderId();
              $scope.$broadcast('publishModalVisible', [vm.publishModalVisible, r, callback, action]);
            }
          }

          function showFlowModal() {
            let r = getSelected();
            if (r && resourceService.canSubmit(r)) {
              vm.flowModalVisible = true;
              $scope.$broadcast('flowModalVisible',
                  [vm.flowModalVisible, r['@id'], r[CONST.model.NAME]]);
            }
          }

          // open the share modal
          function showShareModal() {
            let r = getSelected();
            if (r && resourceService.canShare(r)) {
              vm.shareModalVisible = true;
              $scope.$broadcast('shareModalVisible', [vm.shareModalVisible, r]);
            }
          }

          // open the rename modal
          function showRenameModal() {
            let r = getSelected();
            if (r && resourceService.canWrite(r)) {
              vm.renameModalVisible = true;
              $scope.$broadcast('renameModalVisible', [vm.renameModalVisible, r]);
            }
          }

          // open the new folder modal
          function showNewFolderModal() {
            vm.newFolderModalVisible = true;
            $scope.$broadcast('newFolderModalVisible', [vm.newFolderModalVisible, vm.getFolderId()]);
          }

          vm.getFolderId = function () {
            var folderId;
            var queryStringFolderId = QueryParamUtilsService.getFolderId();
            if (queryStringFolderId) {
              folderId = queryStringFolderId;
            } else {
              folderId = vm.currentFolderId;
            }
            return folderId;
          };

          vm.goToMyWorkspace = function () {
            var url = FrontendUrlService.getMyWorkspace();
            $location.url(url);
          };

          vm.goToSearchAll = function () {
            var url = FrontendUrlService.getSearchAll(vm.getFolderId());
            $location.url(url);
          };

          vm.goToSharedWithMe = function () {
            var url = FrontendUrlService.getSharedWithMe(vm.getFolderId());
            $location.url(url);
          };

          vm.getVisibleCount = function () {
            return Math.min(vm.offset + vm.requestLimit, vm.totalCount);
          };

          // should we show the resource count at the end of the workspace?
          vm.showResourceCount = function () {
            return vm.totalCount !== Number.MAX_VALUE && vm.totalCount > vm.requestLimit;
          };

          // do we have any resources to show?
          vm.hasResources = function () {
            return vm.totalCount > 0;
          };

          vm.search = function (searchTerm) {

            vm.searchTerm = searchTerm;
            var baseUrl = '/dashboard';
            var queryParams = {};
            var folderId = QueryParamUtilsService.getFolderId();
            if (folderId) {
              queryParams['folderId'] = folderId;
            }
            queryParams['search'] = searchTerm;
            // Add timestamp to make the search work when the user searches for the same term multiple times. Without the
            // timestamp, the URL will not change and therefore $location.url will not trigger a new search.
            queryParams['t'] = Date.now();
            var url = $rootScope.util.buildUrl(baseUrl, queryParams);
            $location.url(url);
            if (searchTerm) {
              UIProgressService.start();
            }

          };


        }
      }
    }
)
;
