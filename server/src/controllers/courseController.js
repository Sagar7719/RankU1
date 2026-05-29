import Course from "../models/courseModel.js";

export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const courseData = { ...req.body };
    
    if (courseData.price) {
      courseData.price = Number(courseData.price);
    }
    courseData.isFree = courseData.isFree === 'true' || courseData.isFree === true;

    if (req.file) {
      courseData.image = `/uploads/${req.file.filename}`;
    }

    const course = new Course(courseData);
    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const courseData = { ...req.body };

    if (courseData.price) {
      courseData.price = Number(courseData.price);
    }
    if (courseData.isFree !== undefined) {
      courseData.isFree = courseData.isFree === 'true' || courseData.isFree === true;
    }

    if (req.file) {
      courseData.image = `/uploads/${req.file.filename}`;
    }

    const course = await Course.findByIdAndUpdate(req.params.id, courseData, { new: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (error) {
    next(error);
  }
};
