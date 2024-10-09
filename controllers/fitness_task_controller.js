const { client } = require("./../models/db");

let globalEmail = null;

//used to get plans for the create page
module.exports.fitnessTask = async (req, res, next) => {
  //console.log("PARAMS", req.params.plan);
  //console.log("email??", req.query.email);
  const email = req.query.email;
  globalEmail = email;
  try {
    const getData = `SELECT * FROM public.fitness_task WHERE plan = '${req.params.plan}' and email='${email}'
        ORDER BY task_id ASC `; //probably also where the task in not completed

    const data = await client.query(getData);
    //console.log(data.rows.length);

    res.send({ data: data.rows });
  } catch (error) {
    //console.log(error);
  }
};

//checks to see if date has 3 plans, if plan is on the date, if not, schedule plan
module.exports.checkAndAddPlans = async (req, res) => {
  //console.log("PARAMS", req.params.plan);
  //console.log("email??", req.query.email);
  const email = req.query.email;
  globalEmail = email;
  try {
    const getData = `SELECT * FROM public.fitness_task WHERE date_scheduled = '${req.query.date}' and email = '${email}' and task = '1995ActuallyAPlan'`;
    const data = await client.query(getData);
    //sees if there are 3 plans for the date
    if (data.rows.length < 3) {
      let exist = false;
      //check to see if the plan we requested is one of the plans. if it is, alert back
      for (let i = 0; i < data.rows.length; i++) {
        let thisPlan = data.rows[i].plan;
        //console.log(thisPlan);
        if (thisPlan === req.params.plan) {
          exist = true;
          res.send(true);
        }
      }
      //console.log(exist);
      //if plans doesn't exist, add to the calendar
      if (!exist) {
        try {
          const newData = `INSERT INTO public.fitness_task(plan, task, email, date_scheduled, plan_id, completed)
          SELECT '${req.params.plan}', task, email, '${
            req.query.date
          }', plan_id, ${false}  FROM public.fitness_task WHERE plan = '${req.params.plan.slice(
            0,
            -10
          )}' and email='${email}'
        ORDER BY task_id ASC `;
          const dataTwo = await client.query(newData);
          res.send({ data: dataTwo });
        } catch (error) {
          //console.log(error);
        }
      }
      //if there are 3 plans
    } else {
      res.send(false);
    }
  } catch (error) {
    //console.log(error);
  }
};

//delete specific task
module.exports.Delete = async (req, res, next) => {
  try {
    let deleteData = `DELETE FROM fitness_task WHERE task_id = ${req.params.id} and email= '${globalEmail}'`;
    await client.query(deleteData); //might need to make it completed or save it for copies
    res.status(200).json({
      message: "Data Deleted",
    });
  } catch (error) {
    //console.log(error);
  }
};

//adding specific task
module.exports.addTask = async (req, res) => {
  //console.log(req.body);
  try {
    let insertData = `INSERT INTO fitness_task (plan, task, plan_id, email) VALUES ('${req.body.plan}','${req.body.data}','${req.body.plan_id}', '${req.body.email}')`;
    const response = await client.query(insertData);
    //console.log("Data Saved");
    res.send("Response Received" + response);
  } catch (error) {
    //console.log(error);
  }
};

// more than better using global error handling with write proper api route with proper middleware function
