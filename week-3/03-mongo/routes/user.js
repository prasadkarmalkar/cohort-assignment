const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { AdminValidation } = require("../validations");
const { User, Course } = require("../db");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement signup logic
    const isValid = AdminValidation.safeParse({
        username: req.body.username,
        password: req.body.password
    })
    if (!isValid.success) {
        res.status(400).json(isValid.error.format());
        return;
    }
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    })
    await user.save();
    res.status(201).json({ message: 'User created successfully' })

});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    try {
        const courses = await Course.find({});
        if (courses) {
            res.status(200).json({ courses })
        } else {
            res.status(500).send("Internal server error");
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    purchaseCourse = await Course.findById(req.params.courseId);
    if (!purchaseCourse) {
        res.status(404).json({ msg: 'Course not found' });
        return;
    }
    const headers = req.headers;
    const myUser = await User.findOne({ username: headers.username, password: headers.password });
    if (!myUser) {
        res.send(500).send('Internal server error');
    }
    console.log(myUser)
    myUser.courses.push(purchaseCourse);
    await myUser.save();
    res.status(201).json({ message: 'Course purchased successfully' })

});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic
    try {
        const headers = req.headers
        const myUser = await User.findOne({ username: headers.username, password: headers.password }).populate("courses");
        if (!myUser) {
            res.send(500).send('Internal server error');
        }

        res.status(200).json({courses: myUser.courses})
    } catch (error) {
        res.status(500).send("Internal server error")
        console.log(error);
    }
});

module.exports = router