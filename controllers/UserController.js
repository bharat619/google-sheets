import pino from "pino";
import readline from "readline";
import { google } from "googleapis";
import fs from "fs";
import { Student } from "../models";

const scope = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const TOKEN_PATH = "token.json";

const userController = {
  fetchAllStudent: (req, res) => {
    const logger = pino();
    // each authentication is against a user account.
    // ToDo: store in a database

    // Load app credentials
    // ToDo: Store credentials in a user database
    fs.readFile("credentials.json", async (err, contents) => {
      if (err) {
        logger.error("Invalid credentials");
        return;
      }
      console.log(this);
      this.default.authorize(JSON.parse(contents), this.default.getSheetData);
      const students = await Student.findAll();
      res.render("users", {
        title: "Welcome to View and Edit",
        data: students
      });
    });
  },
  getStudent: async (req, res) => {
    const student = await Student.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!student) {
      req.flash("error", "Student not found");
      res.redirect("/");
    }
    res.render("student", {
      title: `Edit ${student.studentName}`,
      data: student
    });
  },
  editStudent: async (req, res) => {
    const student = await Student.findByPk(req.body.id);
    const { studentName, gender, classLevel, homeState, major } = req.body;
    try {
      await student.update({
        studentName,
        gender,
        classLevel,
        homeState,
        major
      });
      req.flash("success", "Student updated successfully");
      res.redirect("/");
    } catch (e) {
      console.log(e);
      req.flash("error", "Unable to update the student.");
      res.redirect(`/student/${req.body.id}`);
    }
  },
  getNewToken: (oAuthClient, callback) => {
    const authUrl = oAuthClient.generateAuthUrl({
      access_type: "offline",
      scope
    });
    console.log(`Visit ${authUrl} to authorize`);
    const input = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    input.question("Auth Token: ", token => {
      input.close();
      oAuthClient.getToken(token, (err, authToken) => {
        if (err) {
          logger.error(`Error in fetching token ${err}`);
        }
        oAuthClient.setCredentials(authToken);
        fs.writeFile(TOKEN_PATH, JSON.stringify(authToken), err => {
          if (err) {
            logger.error(`Error in saving token ${authToken}`);
          }
          callback(oAuthClient);
        });
      });
    });
  },
  authorize: (credentials, callback) => {
    const { client_id, client_secret, redirect_uris } = credentials.installed;
    const oAuthClient = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    // check if credentials are already present
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        return this.getNewToken(oAuthClient, callback);
      }
      oAuthClient.setCredentials(JSON.parse(token));
      callback(oAuthClient);
    });
  },
  getSheetData: auth => {
    const sheets = google.sheets({ version: "v4", auth });
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
        range: "A:E"
      },
      async (err, res) => {
        if (err) {
          console.error(`An API error ocurred ${err}`);
          return;
        }
        const rows = res.data.values;
        const headers = rows[0]; // can be used for introducing more dynamicity
        const values = rows.slice(1);
        const promiseList = values.map(val => {
          return Student.findOrCreate({
            where: {
              studentName: val[0],
              gender: val[1],
              classLevel: val[2],
              homeState: val[3],
              major: val[4]
            }
          });
        });
        try {
          await Promise.all(promiseList);
        } catch (e) {
          console.log(e);
        }
        return rows;
      }
    );
  }
};

export default userController;
