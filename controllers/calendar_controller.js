const { client } = require("../models/db");
let globalEmail = null;
//may be check and see if its already there?
module.exports.checkEvent = async (req, res) => {
  console.log("try this", req.query);
  globalEmail = req.query.email;
  try {
    const getData = `SELECT * FROM fitness_task WHERE DATE(date_scheduled) IN (${req.query.dates}) AND email= '${req.query.email}' AND task = '1995ActuallyAPlan'`;
    const response = await client.query(getData);
    res.send({ data: response });
  } catch (error) {
    console.log(error);
  }
};

//this is to add the plan to the date that we have it assigned
module.exports.addToDate = async (req, res) => {
  console.log("DATA", req.body.values);
  try {
    const getData = `INSERT INTO fitness_task(plan, task, email, date_scheduled, plan_id, completed)
    VALUES
    ${req.body.values}
    RETURNING task_id`;
    const response = await client.query(getData);
    console.log("Data Saved");
    res.send("Response Received" + response);
  } catch (error) {
    console.log(error);
    //comment
  }
};

module.exports.removeScheduledPlan = async (req, res, next) => {
  console.log(req.params.plan);

  try {
    let removeData = `DELETE FROM fitness_task WHERE plan ='${req.params.plan}' and email = '${globalEmail}'`;
    await client.query(removeData);
    res.status(200).json({
      message: "Data Deleted",
    });
  } catch (error) {
    console.log(error);
  }
};
