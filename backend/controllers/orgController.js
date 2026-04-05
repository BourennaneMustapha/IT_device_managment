import Direction from "../models/directionModel.js";
import Department from "../models/departmentModel.js";
import Position from "../models/positionModel.js";


// ================= CREATE =================

// Direction
export const createDirection = async (req, res) => {
  try {
    const direction = await Direction.create(req.body);
    res.json(direction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Department
export const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Position
export const createPosition = async (req, res) => {
  try {
    const position = await Position.create(req.body);
    res.json(position);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= GET TREE =================

export const getFullTree = async (req, res) => {
  try {
    const directions = await Direction.find();

    const departments = await Department.find();
    const positions = await Position.find();

    const result = directions.map((dir) => ({
      ...dir._doc,
      departments: departments
        .filter((dep) => dep.direction.toString() === dir._id.toString())
        .map((dep) => ({
          ...dep._doc,
          positions: positions.filter(
            (pos) => pos.department.toString() === dep._id.toString()
          ),
        })),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= UPDATE =================

export const updateDirection = async (req, res) => {
  try {
    await Direction.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    await Department.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePosition = async (req, res) => {
  try {
    await Position.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= DELETE (CASCADE) =================

// delete direction → delete departments + positions
export const deleteDirection = async (req, res) => {
  try {
    const departments = await Department.find({ direction: req.params.id });

    const depIds = departments.map((d) => d._id);

    await Position.deleteMany({ department: { $in: depIds } });
    await Department.deleteMany({ direction: req.params.id });
    await Direction.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted Direction + children" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete department → delete positions
export const deleteDepartment = async (req, res) => {
  try {
    await Position.deleteMany({ department: req.params.id });
    await Department.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted Department + positions" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete position
export const deletePosition = async (req, res) => {
  try {
    await Position.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Position" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Change your getFullTree to return the names clearly
export const getPosByDepart = async (req, res) => {
  try {
    const directions = await Direction.find();
    const departments = await Department.find();
    const positions = await Position.find();

    const result = directions.map((dir) => ({
      _id: dir._id,
      name: dir.name,
      departments: departments
        .filter((dep) => dep.direction.toString() === dir._id.toString())
        .map((dep) => ({
          _id: dep._id,
          name: dep.name,
          positions: positions
            .filter((pos) => pos.department.toString() === dep._id.toString())
            .map(pos => ({ _id: pos._id, name: pos.name }))
        })),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};