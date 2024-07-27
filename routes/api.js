"use strict";
const IssueModel = require("../models").Issue;
const ProjectModel = require("../models").Project;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async (req, res) => {
      let projectName = req.params.project;
      let project = await ProjectModel.findOne({ name: projectName });
      try {
        if (!project) {
          res.json({ error: "project not found" });
        }
        let issues = await IssueModel.find({
          project_id: project._id.toString(),
          ...req.query,
        });
        console.log(issues);
        if (!issues) {
          res.json({ error: "issue not found" });
        } else {
          res.json(issues);
        }
      } catch (error) {
        console.error(error);
      }
    })

    .post(async (req, res) => {
      let projectName = req.params.project;
      let issueResult;
      let { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;
      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: "required field(s) missing" });
      }
      try {
        let projectModel = await ProjectModel.findOne({ name: projectName });
        if (!projectModel) {
          projectModel = new ProjectModel({ name: projectName });
          let projectResult = await projectModel.save();
        }
        const issueModel = new IssueModel({
          project_id: projectModel._id,
          issue_title: issue_title || "",
          issue_text: issue_text || "",
          created_by: created_by || "",
          assigned_to: assigned_to || "",
          status_text: status_text || "",
          created_on: new Date(),
          updated_on: new Date(),
          open: true,
        });
        issueResult = await issueModel.save();
      } catch (error) {
        console.error(error);
      }
      // fetch the recently saved issue and get the values of the fields
      let _id = issueResult._id.toString();
      let {
        issue_title: issueTitle,
        issue_text: issueText,
        created_by: createdBy,
        assigned_to: assignedTo,
        status_text: statusText,
        created_on,
        updated_on,
        open,
      } = issueResult;

      res.json({
        assigned_to: assignedTo,
        status_text: statusText,
        open,
        _id,
        issue_title: issueTitle,
        issue_text: issueText,
        created_by: createdBy,
        created_on,
        updated_on,
      });
    })

    .put(async (req, res) => {
      let project = req.params.project;
      let {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body;
      if (!_id) {
        res.json({ error: "missing _id" });
      }
      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text
      ) {
        res.json({ error: "no update field(s) sent", _id: _id });
      }
      try {
        let issue = await IssueModel.findByIdAndUpdate(_id, {
          ...req.body,
          updated_on: new Date(),
        });
        await issue.save();
        res.json({ result: "successfully updated", _id: _id });
      } catch (error) {
        res.json({ error: "could not update", _id: _id });
      }
    })

    .delete(async (req, res) => {
      // let reduce = await IssueModel.deleteMany({ created_by: "Alice" });
      // console.log(reduce);

      let project = req.params.project;
      let _id = req.body._id;
      if (!_id) {
        res.json({ error: "missing _id" });
      }
      try {
        let checkId = await IssueModel.findById(_id);
        console.log(checkId);
        if (checkId === null) {
          res.json({ error: "could not delete", _id: _id });
        } else {
          let deleteIssue = await IssueModel.deleteOne({ _id: _id });
          console.log(deleteIssue);
          res.json({ result: "successfully deleted", _id: _id });
        }
      } catch (error) {
        res.json({ error: "could not delete", _id: _id });
      }
    });
};
