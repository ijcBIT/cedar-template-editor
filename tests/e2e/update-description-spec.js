'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var ShareModal = require('../modals/share-modal.js');
var testConfig = require('../config/test-env.js');

describe('update-description', function () {
  var workspacePage;
  var toastyModal;
  var shareModal;

  var resources = [];

  beforeEach(function () {
    workspacePage = WorkspacePage;
    toastyModal = ToastyModal;
    shareModal = ShareModal;
    browser.driver.manage().window().maximize();
  });

  afterEach(function () {
    workspacePage.clickLogo();
  });


  it("should fail to update description of a resource shared as readable with Everybody group", function () {
    workspacePage.onWorkspace();

    var template = workspacePage.createTemplate('Readable');
    resources.push(template);
    shareModal.shareResourceWithGroup(template, 'template', testConfig.everybodyGroup, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    workspacePage.isInfoPanelOpen().then(function(isOpen) {
      if(!isOpen) {
        workspacePage.openInfoPanel();
      }
      workspacePage.selectResource(template, 'template');
      expect(workspacePage.createDetailsPanelDescriptionEditButton().isDisplayed()).toBe(false);
    });
  });


  it("should update description of a resource shared as writable with Everybody group", function () {
    workspacePage.onWorkspace();

    var template = workspacePage.createTemplate('Writable');
    resources.push(template);
    shareModal.shareResourceWithGroup(template, 'template', testConfig.everybodyGroup, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);
    workspacePage.isInfoPanelOpen().then(function(isOpen) {
      if(!isOpen) {
        workspacePage.openInfoPanel();
      }
      workspacePage.selectResource(template, 'template');
      workspacePage.createDetailsPanelDescriptionEditButton().click();
      workspacePage.createDetailsPanelDescription().sendKeys(workspacePage.createTitle('New description') + protractor.Key.ENTER);
      toastyModal.isSuccess();
    });
  });


  it("should fail to update description of a resource shared as readable with a user", function () {
    var template = workspacePage.createTemplate('Readable');
    resources.push(template);
    shareModal.shareResource(template, 'template', testConfig.testUserName2, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    workspacePage.navigateToUserFolder(testConfig.testUserName1);
    workspacePage.isInfoPanelOpen().then(function(isOpen) {
      if(!isOpen) {
        workspacePage.openInfoPanel();
      }
      workspacePage.selectResource(template, 'template');
      expect(workspacePage.createDetailsPanelDescriptionEditButton().isDisplayed()).toBe(false);
    });
  });


  it("should update description of a resource shared as writable with a user", function () {
    var template = workspacePage.createTemplate('Writable');
    resources.push(template);
    shareModal.shareResource(template, 'template', testConfig.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    workspacePage.navigateToUserFolder(testConfig.testUserName2);

    workspacePage.isInfoPanelOpen().then(function(isOpen) {
      if(!isOpen) {
        workspacePage.openInfoPanel();
      }
      workspacePage.selectResource(template, 'template');
      workspacePage.createDetailsPanelDescriptionEditButton().click();
      workspacePage.createDetailsPanelDescription().sendKeys(workspacePage.createTitle('New description') + protractor.Key.ENTER);
      toastyModal.isSuccess();
    });
  });


  it("should delete the test resources created", function () {
    for (var i = 0; i < resources.length; i++) {
      workspacePage.deleteResourceViaRightClick(resources[i], 'template');
      toastyModal.isSuccess();
      workspacePage.clearSearch();
    }
  });


});


