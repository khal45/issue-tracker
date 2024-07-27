const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let issueId;
suite("Functional Tests", () => {
  suite("Routing Tests", () => {
    suite("POST Requests", () => {
      // Create an issue with every field: POST request to /api/issues/{project}
      test("Create an issue with every field", (done) => {
        chai
          .request(server)
          .keepOpen()
          .post("/api/issues/testing")
          .set("content-type", "application/json")
          .send({
            issue_title: "Issue",
            issue_text: "Functional Test",
            created_by: "fCC",
            assigned_to: "Dom",
            status_text: "Not Done",
          })
          .end((err, res) => {
            issueId = res.body._id;
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, "Issue");
            assert.equal(res.body.assigned_to, "Dom");
            assert.equal(res.body.created_by, "fCC");
            assert.equal(res.body.status_text, "Not Done");
            assert.equal(res.body.issue_text, "Functional Test");
            done();
          });
      });

      // Create an issue with only required fields: POST request to /api/issues/{project}
      test("Create an issue with only required fields", (done) => {
        chai
          .request(server)
          .keepOpen()
          .post("/api/issues/testing")
          .set("content-type", "application/json")
          .send({
            issue_title: "Issue",
            issue_text: "Functional Test",
            created_by: "fCC",
            assigned_to: "",
            status_text: "",
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, "Issue");
            assert.equal(res.body.assigned_to, "");
            assert.equal(res.body.created_by, "fCC");
            assert.equal(res.body.status_text, "");
            assert.equal(res.body.issue_text, "Functional Test");
            done();
          });
      });

      // Create an issue with missing required fields: POST request to /api/issues/{project}
      test("Create an issue with missing required fields", (done) => {
        chai
          .request(server)
          .keepOpen()
          .post("/api/issues/testing")
          .set("content-type", "application/json")
          .send({
            issue_title: "",
            issue_text: "Functional Test",
            created_by: "",
            assigned_to: "",
            status_text: "",
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "required field(s) missing");
            done();
          });
      });
    });

    suite("GET Requests", () => {
      // View issues on a project: GET request to /api/issues/{project}
      test("View issues on a project", (done) => {
        chai
          .request(server)
          .keepOpen()
          .get("/api/issues/testing")
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });

      // View issues on a project with one filter: GET request to /api/issues/{project}
      test("View issues on a project with one filter", (done) => {
        chai
          .request(server)
          .keepOpen()
          .get("/api/issues/testing")
          .query({
            _id: "66a4ee6b4112e3a0da12f3c8",
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body[0]._id, "66a4ee6b4112e3a0da12f3c8");
            done();
          });
      });

      // View issues on a project with multiple filters: GET request to /api/issues/{project}
      test("View issues on a project with multiple filters", (done) => {
        chai
          .request(server)
          .keepOpen()
          .get("/api/issues/testing")
          .query({
            issue_title: "Issue",
            issue_text: "Functional Test",
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body[0].issue_title, "Issue");
            assert.deepEqual(res.body[0].issue_text, "Functional Test");
            done();
          });
      });
    });

    suite("PUT Requests", () => {
      // Update one field on an issue: PUT request to /api/issues/{project}
      test("Update one field on an issue", (done) => {
        chai
          .request(server)
          .keepOpen()
          .put("/api/issues/testing")
          .send({
            _id: "66a4ee6b4112e3a0da12f3c8",
            issue_title: "different",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, "66a4ee6b4112e3a0da12f3c8");
            done();
          });
      });

      // Update multiple fields on an issue: PUT request to /api/issues/{project}
      test("Update multiple fields on an issue", (done) => {
        chai
          .request(server)
          .keepOpen()
          .put("/api/issues/testing")
          .send({
            _id: "66a4eeb579146f0cf62475f2",
            issue_title: "random",
            issue_text: "random",
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, "66a4eeb579146f0cf62475f2");
            done();
          });

        // Update an issue with missing _id: PUT request to /api/issues/{project}
        test("Update an issue with missing _id", (done) => {
          chai
            .request(server)
            .keepOpen()
            .put("/api/issues/testing")
            .send({
              _id: "",
              issue_title: "different title",
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "missing _id");
            });
        });

        // Update an issue with no fields to update: PUT request to /api/issues/{project}
        test("Update an issue with no fields to update", (done) => {
          chai
            .request(server)
            .keepOpen()
            .put("/api/issues/testing")
            .send({
              _id: "66a4ee6b4112e3a0da12f3c8",
              issue_title: "",
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "no update field(s) sent");
            });
        });

        // Update an issue with an invalid _id: PUT request to /api/issues/{project}
        test("Update an issue with an invalid _id", (done) => {
          chai
            .request(server)
            .keepOpen()
            .put("/api/issues/testing")
            .send({
              _id: "jjkinv",
              issue_title: "new title",
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "could not update");
            });
        });
      });

      // Update an issue with missing _id: PUT request to /api/issues/{project}
      test("Update an issue with missing _id", (done) => {
        chai
          .request(server)
          .keepOpen()
          .put("/api/issues/testing123")
          .send({
            issue_title: "update",
            issue_text: "update",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");
            done();
          });
      });
      // Update an issue with no fields to update: PUT request to /api/issues/{project}
      test("Update an issue with no fields to update", (done) => {
        chai
          .request(server)
          .keepOpen()
          .put("/api/issues/testing123")
          .send({
            _id: issueId,
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "no update field(s) sent");
            done();
          });
      });
      // Update an issue with an invalid _id: PUT request to /api/issues/{project}
      test("Update an issue with an invalid _id", (done) => {
        chai
          .request(server)
          .put("/api/issues/testing123")
          .send({
            _id: "88jjk",
            issue_title: "update",
            issue_text: "update",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not update");
            done();
          });
      });
    });

    suite("DELETE Requests", () => {
      // Delete an issue: DELETE request to /api/issues/{project}
      test("Delete an issue", (done) => {
        chai
          .request(server)
          .keepOpen()
          .delete("/api/issues/projects")
          .send({
            _id: issueId,
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully deleted");
            done();
          });
      });

      // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
      test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .delete("/api/issues/projects")
          .send({
            _id: "123invalid",
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not delete");
            done();
          });
      });

      // Delete an issue with missing _id: DELETE request to /api/issues/{project}
      test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .delete("/api/issues/projects")
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");
            done();
          });
      });
    });
  });
});
