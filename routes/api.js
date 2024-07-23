"use strict";
const IssueModel = require("../models").Issue;
const ProjectModel = require("../models").Project;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
    })

    .post(async (req, res) => {
      let projectName = req.params.project;
      let issueResult;
      // if issue does not exist add to database
      let { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;
      try {
        let projectModel = await ProjectModel.findOne({ name: projectName });
        if (!projectModel) {
          projectModel = new ProjectModel({ name: projectName });
          let projectResult = await projectModel.save();
        }
        const issueModel = new IssueModel({
          projectId: projectModel._id,
          issueTitle: issue_title || "",
          issueText: issue_text || "",
          createdBy: created_by || "",
          assignedTo: assigned_to || "",
          statusText: status_text || "",
          createdOn: new Date(),
          updatedOn: new Date(),
          open: true,
        });
        issueResult = await issueModel.save();
        // Write your res.json
      } catch (e) {
        console.error(e);
      }
      // fetch the recently saved issue and get the values of the fields
      let _id = issueResult._id.toString();
      let {
        issueTitle,
        issueText,
        createdBy,
        assignedTo,
        statusText,
        createdOn,
        updatedOn,
        open,
      } = issueResult;
      console.log(
        _id,
        issueTitle,
        issueText,
        createdBy,
        assignedTo,
        statusText,
        createdOn,
        updatedOn,
        open
      );
      res.json({
        assigned_to: assignedTo,
        status_text: statusText,
        open: open,
        _id: _id,
        issue_title: issueTitle,
        issue_text: issueText,
        created_by: createdBy,
        created_on: createdOn,
        updated_on: updatedOn,
      });
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
