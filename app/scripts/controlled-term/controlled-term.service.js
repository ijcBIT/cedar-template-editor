'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.controlledTermService', [])
      .factory('controlledTermService', controlledTermService);

  controlledTermService.$inject = ['$q', '$rootScope', 'controlledTermDataService'];

  function controlledTermService($q, $rootScope, controlledTermDataService) {

    var service = {
      getAcronym             : getAcronym,
      getSelfUrl             : getSelfUrl,
      loadOntologyRootClasses: loadOntologyRootClasses,
      loadTreeOfClass        : loadTreeOfClass,
      loadTreeOfValue        : loadTreeOfValue,
      loadTreeOfValueSet     : loadTreeOfValueSet,
      sortBrowseResults      : sortBrowseResults,
      sortOntologyTree       : sortOntologyTree,
      getLastFragmentOfUri   : getLastFragmentOfUri
    };

    return service;

    /**
     * Service methods.
     */

    function getAcronym(subtree) {
      return subtree.ontology.substr(subtree.ontology.lastIndexOf('/') + 1);
    }

    function getSelfUrl(resource) {
      var selfUrl;
      if (resource.links) {
        selfUrl = resource.links.self;
      }
      else {

        if (resource.type == 'OntologyClass') {

          var acronym;
          if (resource.source) {
            acronym = resource.source.substr(resource.source.lastIndexOf('/') + 1);
          }
          else if (resource.ontology) {
            acronym = resource.ontology.substr(resource.ontology.lastIndexOf('/') + 1);
          }

          selfUrl = "http://data.bioontology.org/ontologies/" + acronym + "/classes/" + encodeURIComponent(resource["@id"]);
        }
        // Not used
        //else if (resource.type == 'ValueSet' || resource.type == 'Value') {
        //  if (resource.provisional) {
        //    selfUrl = resource["@id"];
        //  }
        //  else {
        //    var acronym = resource.vsCollection.substr(resource.vsCollection.lastIndexOf('/') + 1);
        //    selfUrl = "http://data.bioontology.org/ontologies/" + acronym + "/classes/" + encodeURIComponent(resource["@id"]);
        //  }
        //}
      }
      return selfUrl;
    }

    /**
     * Browse results sort.
     */
    function sortBrowseResults(a, b) {
      var aName = getValuesBrowseDisplayLabel(a);
      var bName = getValuesBrowseDisplayLabel(b);
      if (aName < bName) {
        return -1;
      } else if (aName == bName) {
        return 0;
      } else {
        return 1;
      }
    }

    /**
     * Ontology tree sort.
     */
    function sortOntologyTree(a, b) {
      if (a.prefLabel < b.prefLabel) {
        return -1;
      } else if (a.prefLabel == b.prefLabel) {
        return 0;
      } else {
        return 1;
      }
    }

    function getLastFragmentOfUri(uri) {
      return uri.substr(uri.lastIndexOf('/') + 1);
    }

    /**
     * Private functions.
     */

    /**
     * Helper function to get display label of values browse result.
     */
    function getValuesBrowseDisplayLabel(result) {
      if (result.type == 'Ontology') {
        return result.name.trim();
      } else if (result.type == 'ValueSet') {
        return result.prefLabel.trim();
      }
    }

    function loadOntologyRootClasses(ontology, $scope) {
      $scope.searchPreloader = true;
      return $q.all({
        info: ontology,
        tree: controlledTermDataService.getRootClasses(ontology.id)
      }).then(function (values) {
        //if ($scope.treeVisible == true) {
          if (values.tree && angular.isArray(values.tree)) {
            values.tree.sort(controlledTermService.sortOntologyTree);
            $scope.currentOntology = values;
          } else {
            // TODO: Handle error
            if (values.tree.status == 404) {
              alert("No submissions available");
            } else {
              alert(values.tree.statusText);
            }
          }
        //}
        $scope.searchPreloader = false;
        return values;
      });
    }

    /**
     * Show ontology tree and details screen.
     */
    function loadTreeOfClass(selection, $scope) {
      $scope.searchPreloader = true;
      $scope.selectedClass = null;
      $scope.isLoadingClassDetails = true;
      var ontologyAcronym = getLastFragmentOfUri(selection.source);
      $scope.selectedClass = selection;

      // Get class details
      controlledTermDataService.getClassById(ontologyAcronym, selection["@id"]).then(function (response) {
        $scope.classDetails = response;
        $scope.selectedClass.hasChildren = $scope.classDetails.hasChildren;
      });

      $q.all({
        info: controlledTermDataService.getOntologyById(ontologyAcronym),
        tree: controlledTermDataService.getClassTree(ontologyAcronym, selection['@id']),
      }).then(function (values) {
        $scope.currentOntology = values;
        $scope.searchPreloader = false;
        $scope.isLoadingClassDetails = false;
      });
    }

    function loadTreeOfValue(selection, $scope) {
      $scope.searchPreloader = true;
      $scope.selectedClass = null;
      $scope.isLoadingClassDetails = true;
      var ontologyAcronym = getLastFragmentOfUri(selection.source);
      $scope.selectedClass = selection;
      // Get value details
      controlledTermDataService.getValueById(ontologyAcronym, selection["@id"]).then(function (response) {
        $scope.classDetails = response;
        // Values do not have children
        $scope.selectedClass.hasChildren = false;
      });
      $q.all({
        info: controlledTermDataService.getVsCollectionById(ontologyAcronym),
        vs  : controlledTermDataService.getValueTree(selection['@id'], ontologyAcronym),
      }).then(function (values) {
        values.tree = values.vs.children;
        delete values.vs.children;
        delete values.vs.hasChildren;
        $scope.currentOntology = values;
        $scope.searchPreloader = false;
        $scope.isLoadingClassDetails = false;
      });
    }

    function loadTreeOfValueSet(selection, $scope) {
      $scope.searchPreloader = true;
      $scope.selectedClass = selection;
      $scope.classDetails = null;
      $scope.isLoadingClassDetails = true;
      var ontologyAcronym = getLastFragmentOfUri(selection.source);
      $q.all({
        info: controlledTermDataService.getVsCollectionById(ontologyAcronym),
        vs  : controlledTermDataService.getValueSetTree(selection['@id'], ontologyAcronym),
      }).then(function (values) {
        values.tree = values.vs.children;
        delete values.vs.children;
        delete values.vs.hasChildren;
        $scope.currentOntology = values;
        $scope.searchPreloader = false;
        $scope.isLoadingClassDetails = false;
      });
    }
  }
});
