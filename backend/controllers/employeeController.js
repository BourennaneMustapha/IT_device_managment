import { Employee } from "../models/employeeModel.js";

/* ------------------ CREATE EMPLOYEE ------------------ */
export const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, matricule, status , depart , post } = req.body;

    // Check unique matricule
    const exist = await Employee.findOne({ matricule });
    if (exist)
      return res.status(400).json({ message: "Matricule already exists" });

    const employee = await Employee.create({
      firstName,
      lastName,
      matricule,
      status,// default to active
      depart,
      post
    });

    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------------ GET ALL EMPLOYEES ------------------ */
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
     
       if (!employees) {
      return res.status(404).json({ success: false, message: "employees not found" })
    }
    res.status(200).json({
      success: true,
      employees
    })
      
  } catch (err) {
    res.status(500).json({ message: err.message });
    }
   
};

/* ------------------ GET ONE EMPLOYEE ------------------ */
export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------------ UPDATE EMPLOYEE ------------------ */
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    // Update fields
    const { firstName, lastName, matricule, status ,depart , post } = req.body;

    if (matricule && matricule !== employee.matricule) {
      const exist = await Employee.findOne({ matricule });
      if (exist)
        return res.status(400).json({ message: "Matricule already exists" });
    }

    employee.firstName = firstName || employee.firstName;
    employee.lastName = lastName || employee.lastName;
    employee.matricule = matricule || employee.matricule;
    employee.status = status || employee.status;
    employee.depart = depart || employee.depart;
    employee.post = post || employee.post

    await employee.save();

    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------------ DELETE EMPLOYEE ------------------ */
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    if (employee.status !== "active") {
      return res
        .status(400)
        .json({ message: "Cannot delete employee whose status is not active" });
    }

    await Employee.findByIdAndDelete(req.params.id);

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
