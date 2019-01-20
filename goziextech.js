    /* App Dependencies */
    var express = require('express');
    var goziextech = express();
    var port = process.env.PORT || 3000;
    var bodyParser = require('body-parser');
    //var mongo = require('mongodb');
    var mongoose = require('mongoose');
    //var path = require('path');
    var cookieParser = require('cookie-parser');
    //var exphbs = require('express-handlebars');
    var expressValidator = require('express-validator');
    var flash = require('connect-flash');
    var session = require('express-session');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var nodemailer = require('nodemailer');
    var helmet = require('helmet');
    //var nocache = require('nocache');
    //var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    //Switch between Production, Development or Demo Version
    //var runmode = "prod";//prod or dev or demo

    /* Mobile Website*/
    var studyInBudapestAppSite = "https://app.studyinbdudapest.com/";
    var studyInEuropeAppSite = "https://app.studyineuropeapp.com/";
    var travelAdmissionsAppSite = "https://app.traveladmission.com/";

    /* Desktop Website */
    var studyInBudapestWebSite = "http://www.studyinbudapest.com";
    var studyInEuropeWebSite = "http://www.studyineuropeapp.com/";
    var travelAdmissionWebSite = "http://www.traveladmission.com/";

    /* Mobile App download Links */
    var studyInEuropeAppDownloadLink = "http://www.studyineuropeapp.com/download-api";
    var studyInBudapestAppDownloadLink = "http://www.studyinbudapest.com/download-api";
    var travelAdmissionAppDownloadLink = "http://www.traveladmission.com/download-api";


    /* Application Names */
    var studyInBudapestAppName = "Studyinbudapest Mobile App";
    var studyInEuropeAppName = "Studyineurope Mobile App";
    var travelAdmissionAppName = "Travel Admission App";

    /* Logos */
    var studyInBudapestEmailLogo = "http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png";
    var studyInEuropeEmailLogo = "http://www.studyineuropeapp.com/images/study-in-europe-mobile-app-icon-study-abroad-european-universities.png";
    var travelAdmissionEmailLogo = "http://www.studyineuropeapp.com/images/study-in-europe-mobile-app-icon-study-abroad-european-universities.png";

    /* Default Application Portals */
    var studyInBudapestApplyUrl = "http://www.studyinbudapest.com/search-universities";
    var studyInEuropeApplyUrl = "http://www.studyinbudapest.com/search-universities";
    var travelAdmissionApplyUrl = "http://www.traveladmission.com/search-universities";

    /* App Recruitment Dashboard for Universities */
    /* Demos */
    var demoVersionrecruitmentSite = "https://demo.studyinbudapest.com/"; //Needed as one because app can be switched between
    var studyInBudapestdemoVersionrecruitmentSite = "https://demo.studyinbudapest.com/";
    var studyInEuropedemoVersionrecruitmentSite = "https://demo.studyineuropeapp.com/";
    var travelAdmissiondemoVersionrecruitmentSite = "https://demo.traveladmission.com/";

    /* Lives */
    var studyInBudapestrecruitmentSite = "https://recruitment.studyinbudapest.com/";
    var studyInEuroperecruitmentSite = "https://recruitment.studyineuropeapp.com/";
    var travelAdmissionrecruitmentSite = "https://recruitment.traveladmission.com/";
    var localHostrecruitmentSite = "http://localhost:3000/";

    /* Sending Email Addresses */
    var studyinbudapestSenderemail = studyInBudapestAppName + '<admissions@studyinbudapest.com>';
    var studyineuropeSenderemail = studyInEuropeAppName + '<admissions@studyineuropeapp.com';
    var traveladmissionSenderemail = travelAdmissionAppName + '<admissions@traveladmission.com';

    /* Emails Addresses */
    var studyinbudapestemail = "<admissions@studyinbudapest.com>";
    var studyineuropeemail = "<admissions@studyineuropeapp.com>";
    var traveladmissionemail = "<admissions@traveladmission.com>";
    var preferedRecivingEmail = "admissions@studyinbudapest.com";

    /* Thanks You */
    var studyInEuropeEmailSignOff = "Study in Europe";
    var studyInBudapestEmailSignOff = "Study in Budapest";
    var travelAdmissionEmailSignOff = "Travel Admission";

    //View Engine
    /*goziextech.set('views',path.join (__dirname, 'views'));
    goziextech.engine('handlebars', exphbs({defaultLayout:'layout'}));
    goziextech.set('view engine', 'handlebars');
    */

    //Req.header is different from Res.header
    goziextech.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        //res.header("X-Frame-Options", "DENY");    
        next();
    });

    //Securities
    goziextech.use(helmet());
    goziextech.disable('x-powered-by');
    //goziextech.use(nocache())

    //BodyParser Middleware
    goziextech.use(bodyParser.json());
    goziextech.use(bodyParser.urlencoded({
        extended: true
    }));
    goziextech.use(cookieParser());

    //Express Session
    goziextech.use(session({
        secret: 'secret',
        saveUninitialized: true,
        resave: true

    }));

    /*   
    goziextech.use(session({
      name: 'session',
      keys: ['key1', 'key2'],
      cookie: {
        secure: true,
        httpOnly: true,
        domain: 'example.com',
        path: 'foo/bar',
        expires: expiryDate
      }
    }))*/

    //Passport init
    goziextech.use(passport.initialize());
    goziextech.use(passport.session());

    //Express Validator
    goziextech.use(expressValidator({
        errorFormarter: function (param, msg, value) {
            var namespace = param.split('.'),
                root = namespace.shift(),
                formParam = root;

            while (namespace.length) {
                formParam += '[' + namespace.shift() + ']';
            }
            return {
                param: formParam,
                msg: msg,
                value: value
            };

        }
    }));

    // Connect Flash
    goziextech.use(flash());

    // Global Vars
    goziextech.use(function (req, res, next) {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        next();
    });

    goziextech.use(express.static(__dirname + '/universityapp'));
    Students = require('./models/studentsmodel.js');
    Universities = require('./models/universitymodel.js');
    // universitymaillist = require('./models/universitymailer.js');//connect universities mailer collection
    //Connect to Mongoose
    //mongoose.connect('mongodb://localhost/students');
    //var db = mongoose.connection;

    // Connect to Mongo DB
    var promise = mongoose.connect('mongodb://localhost:/Studyinbudapestusers', {
        useMongoClient: true,
        /* other options */
    });
    promise.then(function (db) {
        db.model('Students'); //Student model  
        db.model('Universities'); // Universities Model
        // db.model('universitymaillist'); // Universities Mailer Model    
    });

    //Passport
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    //Serialize Passport
    passport.deserializeUser(function (id, done) {
        Universities.getUniversitiesById(id, function (err, user) {
            done(err, user);
        });
    });

    //Passport Strategy
    passport.use(new LocalStrategy(
        function (username, password, done) {
            Universities.getUniversityByUsername(username, password, function (err, user) {

                if (err) return console.log(err);
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect username.'
                    });
                }
                return done(null, user);

                /* if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          Students.comparePassword(password, Students.password, function(err,isMatch))
           if (err) return console.log(err);
          if (isMatch) {
           return done(null,user);
          } else {
              return done(null, false, { message: 'Incorrect password.' }
          }

           return done(null, user);*/
            });
        }));


    //Nodemailer Study in Budapest Transporter
    let transporter = nodemailer.createTransport({
        host: 'mail.studyinbudapest.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'admissions@studyinbudapest.com', // user
            pass: '@dmissions!988' // password
        },
        tls: {
            rejectUnauthorized: false
        }

    });

    //Nodemailer Study in Europe Transporter
    let studyInEuropeTransporter = nodemailer.createTransport({
        host: 'mail.studyineuropeapp.com',
        port: 465,
        secure: true,
        auth: {
            user: 'admissions@studyineuropeapp.com',
            pass: '@dmissions1988'
        },
        tls: {
            rejectUnauthorized: false
        }

    });

    //Nodemailer Travel Admission Transporter
    let travelAdmissionransporter = nodemailer.createTransport({
        host: 'mail.studyineuropeapp.com',
        port: 465,
        secure: true,
        auth: {
            user: 'admissions@traveladmission.com',
            pass: '@dmissions1988'
        },
        tls: {
            rejectUnauthorized: false
        }

    });

    goziextech.post('/',
        passport.authenticate('local', {
            failureRedirect: '#/login/error',
            failureFlash: true
        }),
        //Username and Password comes from req               
        function (req, res, next) {
            //If successfull
            res.redirect('#/university/account/' + req.user.id);
            //res.json(user);
        });

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            //req.user.isAuthenticated();
            return next();
        } else {
            /* res.json({
              status: "You are unathourized";   
             });*/
            res.redirect('/');
        }

    }

    function ensurePostPutDeleteIsAuthorized(req, res, next) {
        var fullrequesturl = req.protocol + '://' + req.get('host') + req.originalUrl;
        var requesturl = req.get('host');
        var siteurl = "localhost:3000"; //127.0.0.1:3000 in production
        var codeprinthtmlheight = req.body.cp;
        var codeprinthtmlwidth = req.body.w;
        var goziextechCustomKey = "/validated@GoziexTech1988";
        var validKeyCombination = goziextechCustomKey + codeprinthtmlheight + codeprinthtmlwidth;
        var ValidatedKeyforRequest = "/validated@GoziexTech198825320";
        var websiteSecurityCheckIsPassed = requesturl == siteurl;
        var validCalcutationCheckIsPassed = codeprinthtmlheight + codeprinthtmlwidth;
        var validKeyCheckIsPassed = validCalcutationCheckIsPassed > 100;

        if (websiteSecurityCheckIsPassed && validKeyCheckIsPassed) {
            //console.log("All checks passed");
            return next();
        } else {
            res.json({
                status: "You are unathourized"
            });

            console.log(fullrequesturl);
            console.log(req.body);
            console.log("This request is a spoof, did not pass Goziex Tech authorized origin test");
            console.log(requesturl);
            console.log(siteurl);
            console.log(validCalcutationCheckIsPassed);
            console.log(codeprinthtmlheight);
            console.log(codeprinthtmlwidth);
            console.log(goziextechCustomKey);
            console.log(validKeyCombination);
            console.log(ValidatedKeyforRequest);
            return false;
        }

    }

    function logError(err) {
        if (err) {
            return console.log(err);
        }
    }

    function sendReplyAsOk(replied, res) {
        if (replied) {
            res.sendStatus(200);
        }
    }

    function studyInBudapestProperties() {

        var studyInBudapestProperties = ({
            "appName": studyInBudapestAppName,
            "universityemail": studyinbudapestemail,
            "admissionOfficeEmail": studyinbudapestSenderemail,
            "baseurl": studyInBudapestAppSite,
            "signOffName": studyInBudapestEmailSignOff,
            "signOffLogo": studyInBudapestEmailLogo,
            "emailsender": transporter,
            "applicationportal": studyInBudapestApplyUrl,
            "recruitmentSite": studyInBudapestrecruitmentSite,
            "localhostrecruitsite": localHostrecruitmentSite,
            "website": studyInBudapestWebSite,
            "demoVersionrecruitmentSite": studyInBudapestdemoVersionrecruitmentSite,
            "appDownloadLink":studyInBudapestAppDownloadLink
        });
        return studyInBudapestProperties;
    }

    function studyInEuropeProperties() {
        var studyInEuropeProperties = ({
            "appName": studyInEuropeAppName,
            "universityemail": studyineuropeemail,
            "admissionOfficeEmail": studyineuropeSenderemail,
            "baseurl": studyInEuropeAppSite,
            "signOffName": studyInEuropeEmailSignOff,
            "signOffLogo": studyInEuropeEmailLogo,
            "emailsender": studyInEuropeTransporter,
            "applicationportal": studyInEuropeApplyUrl,
            "recruitmentSite": studyInEuroperecruitmentSite,
            "localhostrecruitsite": localHostrecruitmentSite,
            "website": studyInEuropeWebSite,
            "demoVersionrecruitmentSite": studyInEuropedemoVersionrecruitmentSite,
            "appDownloadLink":studyInEuropeAppDownloadLink
        });
        return studyInEuropeProperties;
    }

    function travelAdmissionProperties() {
        var travelAdmissionProperties = ({
            "appName": travelAdmissionAppName,
            "universityemail": traveladmissionemail,
            "admissionOfficeEmail": traveladmissionSenderemail,
            "baseurl": travelAdmissionsAppSite,
            "signOffName": travelAdmissionEmailSignOff,
            "signOffLogo": travelAdmissionEmailLogo,
            "emailsender": travelAdmissionransporter,
            "applicationportal": travelAdmissionApplyUrl,
            "recruitmentSite": travelAdmissionrecruitmentSite,
            "localhostrecruitsite": localHostrecruitmentSite,
            "website": travelAdmissionWebSite,
            "demoVersionrecruitmentSite": travelAdmissiondemoVersionrecruitmentSite,
            "appDownloadLink":travelAdmissionAppDownloadLink
        });
        return travelAdmissionProperties;
    }

    function recievedProperties(req) {
        var recievedData = req.body;
        var recievedProperties = ({
            "recievedData": recievedData,
            "stdntfnmae": recievedData.first_name,
            "stdntlname": recievedData.last_name,
            "stdnteml": recievedData.email,
            "stdntcountry": recievedData.country,
            "uvrstynm": recievedData.university,
            "course": recievedData.course,
            "appversion": recievedData.appversion,
            "apprunmode": recievedData.runmode //prod or dev or demo
        });
        return recievedProperties;
    };

    var dataUniversity = {
        "universitiesinfo": [
            {
                id: "1",
                "universityname": "Eotvos Lorand University",
                "aboutUniversity": "Over the last hundred years, Eötvös Loránd University (ELTE) has had many world famous scientists and four Nobel Prize laureates among its teachers and alumni. The current number of students enrolled yearly has reached 28,000, and there is an academic staff of 1,800 highly-qualified teachers and researchers.ELTE has an extensive international network of partner institutions. It has about 400 Erasmus partner institutions and about 200 more bilateral international partners and it is also member of nine international university networks. Through these partner agreements, students and staff at ELTE have the possibility to gain international experience not only when studying at or visiting partner institutions, but also when they meet incoming international students and staff at home, i.e., during their studies at ELTE. Currently, on average about 2,000 international students from over 80 countries study at ELTE.",
                "generalRequirement": "<p>Bachelor Programs<br><br><p>1. A proof of English language skills is required (secondary school grades are sufficient, language exams are preferred).</p><br><p>2. Students' reading skills should be at a level where they can locate and organise several pieces of deeply embedded information, inferring which information in the text is relevant.</p><br><p>3. Record of the final two years in secondary school</p><br><p>4. CV </p><br><p>5. Secondary school certificate</p><br><p>6. Motivation Letter</p><br><p>7. Medical Certificate</p><br><p>8. Language requirements: If Available</p><br><p>9. Copy of the main pages of the passport</p><br><h2 class='title-new'>Application Deadline</h2><br><p>Start program : 05, Sep <br><br>Deadline for applications - September intake: 30, Apr<br>Deadline for applications - February intake: 31, Oct <br><br><strong>Masters Programs<br><br><br><p>1. Bachelor Degree. An official copy of your completed Bachelor degree.</p></strong><p>2. Academic records. Also called (Transcript of records).</p><br><p>3. Research Proposal. Note you will need to consult with the coordinating department for more information during your application process.</p><br><p>4. CV </p><br><p>5. Secondary school certificate</p><br><p>6. Motivation Letter</p><br><p>7. Letter of Reference. Also called (Letter of recommendation) From a former instructor and/or employer.</p><br><p>8. Language requirements:   Accepted proof of proficiency: CEFR B2 , IELTS: 6, TOEFL 72</p><br><p>9. Copy of the main pages of the passport</p><br><p>10. Statement of Purpose in English. Also called (Letter of Motivation)</p><br><h2 class='title-new'>Application Deadline</h2><br><p>Start program : 06, Sep <br><br>Deadline for applications - September intake: 24, July</p><br><p>Deadline for applications - Febuary intake: 01, January</p>",
                "data-keyword": "",
                "country": "Hungary",
                "student_payment": true,
                "application_url": "https://apply.elte.hu/applicant/register",
                "email":"iso@btk.elte.hu",
                "campusImgUrl": "",
                "universityProfilePic": "elte",
                "skypeID": "",
                "examinationPortal": "",
                "universityAddress": "",
                "universityLogo": "images/elte-logo.png",
                "visibility": "show",
                "courses": [{
                        "courseName": "American Studies MA",
                        "description": "The robust presence of the United States throughout the world, well observable in the contexts of politics, economy, and culture, calls for a body of experts who – aside from having excellent English language skills – have a specialised knowledge in the history, politics, society, culture, language, and literature of the United States. With this aim in mind, the MA programme in American Studies seeks to impart its graduates with the necessary theoretical knowledge and practical skills that can be fruitfully utilised in both private and public sector establishments interested in the communication and/or representation of American values and interests. The two-year long programme does not confer teaching qualifications. Students are eligible for admission to PhD programmes. Students will acquire: a sound knowledge of and fluency in American English (oral and written, academic style) in-depth knowledge of the culture, history, and literature of the United States.",
                        "tuitionFee": "2200",
                        "deadline": "16/07/2018",
                        "requirements": "Online application form<br><br>    Relevant pages of the passport. Scanned, in color all personal details and expiry date must be shown. Passport must be valid.<br><br>    Proof of language proficiency. Official test result or certificate must be provided; see program specific proficiency requirements.<br><br>    An official copy of your completed secondary education (high school). Notarized copy only on request.<br><br>    Bachelor Degree. An official copy of your completed Bachelor degree.<br><br>    Academic records. Also called 'Transcript of records'.<br><br>    A Curriculum Vitae in English. In MS Word format with one low resolution photo.<br><br>    Research Proposal. Please consult with the coordinating department for more information.<br><br>    Letter of Reference. Also called 'Letter of recommendation.' From a former instructor and/or employer.<br><br>    Statement of Purpose in English. Also called 'Letter of Motivation.'<br><br>    Copy of application fee transfer. A bank slip showing that the application fee has been transferred to the University’s bank account.",
                        "language": "TOEFL PBT (Paper-based test): 550-583 or<br><br>    TOEFL IBT (Internet-based test): 79-93 or<br><br>    IELTS (International English Language Testing System): 6.5 or<br><br>    CEFR (Common European Framework of Reference): C1",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 0
                    },
                    {
                        "courseName": "Applied Economics BA",
                        "description": "Our program offers rigorous training in the methods and main topics of Economics. Building upon the curricula of the best American and European programs and using up-to-date textbooks, our teaching staff has built a carefully crafted and interconnected set of demanding courses with one goal in mind: to turn every student, prepared to put in the necessary work, into an accomplished young professional who can work as an analyst or as a civil servant for government agencies, who can carry on their studies at the M.A. level towards becoming a researcher or a professor, or who can use their skills and competence in any other field from journalism to business to data analysis. Many of our faculty have studied or worked abroad, and we pride ourselves in providing a nurturing environment with small classes and open doors. Our courses range from the obligatory staples (Mathematics, Statistics, Micro-, Macroeconomics, Econometrics) to applied elective courses, usually including hands-on work with data, offered by some of the best research economists of Budapest. Strength of program: Our program stands out by taking the quality of teaching very seriously, striving to improve and listening to feedback from students; by especially stressing quantitative methods, preparing students for the careers of the future requiring data analysis; by the faculty being involved in a multitude of research projects into areas as diverse as health economics, behavioral economics and education economics that ambitious students can join as research assistants early on; by listening to a network of prestigious peers (including our international advisory board, the Economics faculty of Central European University and some of the most excellent research economists of Hungary) as well as the growing cohorts of our loyal alumni all over the world; and by close links to a number of internationally recognized institutions that apply Economics in their work including policy think tanks and applied research centers, whose senior researchers often offer elective courses and where our students can work as interns or after graduation.",
                        "tuitionFee": "2400",
                        "deadline": "31/05/2018",
                        "requirements": " 1. Basic mathematics: graphs and properties of functions, system of equalities and inequalities, logarithm rules, power rules, basics of analytical geometry<br><br>2. Students' reading skills should be at a level where they can locate and organise several pieces of deeply embedded information, inferring which information in the text is relevant.",
                        "language": "CEFR B2 , IELTS: 6, TOEFL 72",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "180",
                        "courseID": 1
                    },
                    {
                        "courseName": "Astronomy MSc",
                        "description": "The objective of the Astronomy Master's Degree Program is to provide a comprehensive knowledge of astronomy including related interdisciplinary areas. Students will also acquire competencies in the wider field of scientific research, in the use of technical language, in team work and in the communication of scientific results, they will also develop an ability to resolve novel or unusual problems arising in a multidisciplinary context. The objective of the Astronomy MSc programme is the formation of fully trained astronomers and astrophysicists capable of supervised observational and theoretical research in astronomy and related fields.",
                        "tuitionFee": "4190",
                        "deadline": "20/05/2018",
                        "requirements": "BSc degree or equivalent in physical sciences, earth sciences or any other area of natural sciences BSc-level knowledge of key areas of mathematics, physics and information technology (IT). If BSc degree is in (or with a specialisation in) physical sciences, this knowledge is assumed; otherwise, evidence in the form of transcripts must be presented.<br><br>Preferably, BSc-level knowledge of astronomy. If BSc degree is in (or with a specialisation in) astronomy or astrophysics, this knowledge is assumed; otherwise, evidence in the form of transcripts must be presented.<br><br>Min. ECTS values expected in each knowledge area:<br><br>Mathematics/IT (min. 15 ECTS): Calculus, Linear algebra, Numerical methods, Probability theory, Mathematical statistics, Programming and IT<br><br>Physics (min. 20 ECTS): Mechanics, Waves and optics, Electromagnetism, Atomic/nuclear physics, Thermodynamics, Quantum physics<br><br>Astronomy (min. 20 ECTS): Elements of astronomy, Astrometry, Elements of astrophysics, Astronomical IT, Astronomical observing<br><br>Applicants with no such knowledge in astronomy may still be admitted but they will be compelled to attend a selected set of preparatory courses in BSc-level astronomy. This is likely to increase the full training period by 1 or 2 semesters.",
                        "language": "The successful applicant must have a good command of English. Several kinds of internationally recognized certificates of English language at advanced level are accepted. In the absence of a certificate the applicant's command of English will be assessed during the interview.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 2
                    },
                    {
                        "courseName": "Biology MSc",
                        "description": "Students participate in intensive advanced and high level courses in the different fields of biology, which are the most relevant for their specialization, to make them informed about the recent developments and frontline problems. Some 60 % of time is practical hours (spent on laboratory/field practice and on research) ensuring knowledge of state of the art methods. The curriculum is assembled from intensive advanced level courses on the theoretical aspects of selected disciplines and special seminar series on problems in a narrower field of science. The program also involves practical courses and a supervised research activity, which is needed for the preparation of the “M.Sc. Thesis”. In the first two semesters emphasis is on theory and basic laboratory or field practice.  The third and the fourth semesters are devoted to research and preparation of thesis. The training medium is English so students can gain a better command of the academic English in different fields of biology.",
                        "tuitionFee": "4190",
                        "deadline": "31/05/2018",
                        "requirements": "BSc degree is required preferably in biology related fields.",
                        "language": "Transcript of test report of International English Language Testing System (IELTS) or equivalent (e.g. TOFEL).",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 3
                    },
                    {
                        "courseName": "Cartography MSc",
                        "description": "The objective of the Master program is to train Cartographers with a professional cartographic approach based on high level theoretical and practical knowledge. They are trained to be able to manage and coordinate cartographic and geoinformatic research projects as well as to have the knowledge and skills to solve traditional cartographic or information technology-based problems. The best students can continue their studies in our PhD program. The program provides students with a broad scale of knowledge in Cartography and Geoinformatics in combination with geography, other earth sciences, information technology, database management, web-based mapping services, etc. Students acquire the theory as well as the methodologies in the development and implementation of the latest visualization technics.",
                        "tuitionFee": "3000",
                        "deadline": "31/05/2018",
                        "requirements": "The following BSc degrees are considered acceptable: cartography, geoinformatics (GIS), geomatics, geography, earth sciences. Partly acceptable BSc degrees: environmental science, computer science, surveying.",
                        "language": "At least Intermediate level English language skills.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 4
                    },
                    {
                        "courseName": "Chemistry MSc",
                        "description": "The chemistry master program is intended to be a training with a flexible choice of courses, where students with different entry skills are able to acquire a standard knowledge of all fields in chemistry at the master level, a general experience in laboratory work, an advanced knowledge at least in one of the disciplines of chemistry, and the skill to develop and apply ideas within a research project. The program contains limited number of obligatory courses. The courses are divided into five parts. The first part contains elective theoretical and laboratory courses on several chemistry related science disciplines, like mathematics, physics, biology, geoscience, etc. The second part contains obligatory major theoretical and laboratory courses on all disciplines of chemistry containing knowledge and skill termed as an expected minimum for a master degree. The third part of the master program consists of a great number of elective, specialized chemical courses and four week summer internship. The fourth part contains an obligatory 30 credit master thesis. The fifth part of the master program contains optional courses in other sciences. The training is controlled via output requirements. For example, the theoretical knowledge of the students is tested in four comprehensive examinations an there are some credit minima on overall laboratory experience. Academic specializations can be obtained if the number of the specialized courses sums up to 26 credits in different grouping of the courses.",
                        "tuitionFee": "4190",
                        "deadline": "01/06/2018",
                        "requirements": "The successful applicant must have a BSc. degree in Chemistry, in Chemical Engineering or in any similar degree including reasonable amount of chemistry (at least 40 ECTS chemistry) in the curriculum. The application package should contain a short CV, copy of the degree certificate, transcript of results, and a language examination certificate. The certificates need not be translated, they are accepted in most of the European languages. Applicants are requested to perform reasonably at GRE or EchemTest.",
                        "language": "The successful applicant must have a good command of English. Several kinds of internationally respected certificate of English language at advanced level are accepted.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 5
                    },
                    {
                        "courseName": "Computational and Cognitive Neuroscience MSc",
                        "description": "Cognitive Science is an interdisciplinary Master Program involving different scientific fields of natural sciences, technological sciences, and humanities as well. The focus of investigations is on the phenomena of cognition - perception, attention, memory, reasoning, thinking, and behaviour - from an interdisciplinary perspective: Anthropology, Artificial Intelligence, Biology, Linguistics, Neuroscience, Philosophy, and Psychology have contributed to its development as core disciplines. The program offers a timely approach to answer the deep philosophical question of what is human cognition – ‘Who we are, and what kind of capabilities make us human’, with the help of modern scientific methods, like model building and sophisticated monitoring techniques (eye-tracking, EEG). The relevance of such an approach gains support from the constant need of building a knowledge-based society.",
                        "tuitionFee": "1300",
                        "deadline": "16/06/2018",
                        "requirements": "A) Full acknowledgement is given for the following degrees: a Bachelor’s degree in: Psychology, Computer Engineering, Software Engineering, Biology, Liberal Arts: Philosophy Specialisation; college degrees (as according to the Hungarian higher education system before 2006): Psychology, Information Technology, Computer Programmer Mathematician, Teacher of Computer Science, Teacher of Biology, Biology Laboratory Operator; university degrees (as according to the Hungarian higher education system before 2006): Psychology, Information Technology, Computer Programmer Mathematician, Teacher of Informatics, Applied Plant Biology, Applied Zoology, Biophysics, Biology, Molecular Biology, Teacher of Biology, Aesthetics; Ethics, Anthropology and Social Studies, Philosophy.<br><br>If you have any of the degrees listed above or you are going to obtain a degree by the time of the results announcement, you do not have to do anything else but send a copy of the degree certificate (hereinafter diploma).<br><br>Please note that the degrees described above as well as the full acknowledgement are only for degrees obtained in Hungary. If your degree was obtained outside Hungary, it must be submitted for evaluation (see below). However, the above list will give you an idea of what degrees can be accepted.<br><br>B) Conditionally accepted Bachelor’s degrees which will be considered in the first place: Liberal Arts: Communications and Media Studies, Business Information Technology, Applied Economics, Economic Analysis, Hungarian Linguistics and Literature: Language Technology specialisation and Theoretical Linguistics specialisation, Pedagogy, Biochemical Engineering, Chemical Engineering, Architecture, Civil Engineering, Mechanical Engineer, Mechatronics Engineering, Electrical Engineer, Economist in Business Administration and Management, Technical Manager, Mathematics, Communication and Media Science, Economist in Economic and Financial Mathematical Analysis. In the case of these degrees they must fulfil the following credit requirements: at least 10-12 credits (ECTS) which can be recognized from the earlier studies in at least three of the following fields: mathematics, statistics; informatics; epistemology; logic; linguistics; physiology and anatomy. (Besides the degrees listed above, any other degree can be accepted if it fulfils the 12 ECTS requirement.)<br><br>The requirement, i. e. the existence of the credits listed above is established through a preliminary examination of the credits which must be initiated by the applicant in the form of a free-text request.<br><br>If the applicant is taking their final examination during the current semester and their degree certificate (diploma) is not issued before the application deadline, a certification is required, which verifies that the applicant will presumably receive a degree. In case of being accepted as a student, however, the applicant must present the diploma upon enrolment at the latest.<br><br>The educational and outcome requirements are defined by the Ministry of Human Capacities (Regulation No. 18/2016. (VIII. 5.)) . The details of the application and admission process are defined by the Organisational and Operational Regulations of ELTE.",
                        "language": "The language of instruction for the entire program is English, so a very good command of English is required during the oral entrance exam and throughout the whole program. The language knowledge is assessed and evaluated during the interview.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 6
                    },
                    {
                        "courseName": "Computer Science BSc",
                        "description": "The objective is to train Computer Scientists with a professional knowledge based on a solid theoretical background knowledge.  They have the skills to take part in software development, in developing information systems and system management in various areas. Computer Scientists often acts as mediators between the customers of information systems and the producers. In this way, the job of a Computer Scientist synthesises the constructive activity of engineers with the general problem-solving attitude of mathematicians while participating in teams of large-scale projects.<br><br>The program provides students with a broad education in Computer Science and Software Engineering in combination with specialised work in computer and information processing techniques, programming languages, data structures, information retrieval, operating systems, compiler design etc. Students learn the theory as well as the methodologies and techniques in the development and implementation of computer systems. The more practical programming courses are aided by several courses in pure and applied mathematics and theoretical computer science courses throughout the curriculum.",
                        "tuitionFee": "3000",
                        "deadline": "30/04/2018",
                        "requirements": "Applicants are required to have sufficiently good grades in their secondary school finishing documents, especially from Mathematics. Intermediate level of English knowledge is also required.",
                        "language": "A proof of at least Intermediate level English language skills is required (secondary school grades are sufficient, language exams are preferred).",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "180",
                        "courseID": 7
                    },
                    {
                        "courseName": "Computer Science MSc",
                        "description": "The objective is to train Software Designers with a professional knowledge based on a solid theoretical background knowledge.  They have the skills to take part in program development, in developing information systems and system management in various areas. The Software Designer often acts as a mediator between the customers of information systems and the producers. In this way, the job of a Software Designer synthesizes the constructive activity of engineers with the general problem-solving attitude of mathematicians while participating in teams of large-scale projects.<br><br>The program provides students with a broad education in Computer Science in combination with specialized work in computer and information processing techniques, programming languages, data structures, information retrieval, operating systems, compiler design etc. Students learn the theory as well as the methodologies and techniques in the development and implementation of computer systems. The more practical programming courses are aided by several courses in pure and applied mathematics and theoretical computer science courses throughout the curriculum.",
                        "tuitionFee": "3000",
                        "deadline": "30/04/2018",
                        "requirements": "Holding a BSc degree in Computer Science or obtaining altogether at least 60 ECTS credits in informatics and mathematical subjects related to computer science during a completed Bachelor’s program.",
                        "language": "At least Intermediate level English language skills.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 8
                    },
                    {
                        "courseName": "Computer Science Preparatory",
                        "description": "This program is recommended for future students who want to build a firm basis for their further studies in the BSc program of Computer Science. Students who get admitted to Computer Science BSc but cannot reach the minimum level in the entrance examination, will also be redirected to our Preliminary Course.",
                        "tuitionFee": "2000",
                        "deadline": "30/04/2018",
                        "requirements": "A proof of English language skills is required (secondary school grades are sufficient, language exams are preferred).",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "Preparatory",
                        "courselanguage": "English",
                        "credits": "Not Available",
                        "courseID": 9
                    },
                    {
                        "courseName": "Computer Science for Autonomous Systems MSc",
                        "description": "The Computer Science for Autonomous Systems MSc prepares students for the design and development of software for intelligent systems including, e.g. autonomous cars. Students will get up-to-date knowledge in one of the fastest growing and dominant technological trends of the future. The training offers students the opportunity to acquire valuable knowledge and competences in software technology, real-time systems, artificial intelligence, robotics and deep learning, data mining, computer image and signal processing, process control, computer graphics and vision. Electives include GIS systems, autonomous systems security issues and industrial mathematics. Students will be involved in the work of the research labs and can work on real industrial research together with professionals of leading companies interested in autonomous systems and autonomous driving.",
                        "tuitionFee": "3000",
                        "deadline": "16/07/2018",
                        "requirements": "At least Intermediate level English language skills",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 10
                    },
                    {
                        "courseName": "Cultural Anthropology MA",
                        "description": "The general goal of the program is to give relevant knowledge to students about the common universal human characteristics and values in their diverse and complex manifestations from the perspective of cultural anthropology.<br><br>Cultural anthropology is based on critical and interpretative thinking and uses the approaches and methodology of social sciences. Cultural anthropology has an applied perspective; methodologies include interpretation and field research.<br><br>Anthropologists aim to understand societies and cultures in their everyday life, the micro and personal levels of social interactions and cultural communication. Besides, anthropologists interpret their micro-focusing research in a holistic way with comprehensive analyses of the historical and sociological contexts of their field.<br><br>With this in mind, students of the Cultural Anthropology MA program will learn about theories and approaches, main research topics and results of cultural anthropology. The program particularly focuses on fieldwork research. The students of the program make participant observations in micro communities to attain the cultural anthropological skills and obtain anthropological experience. The students write and defend their thesis from interpretations of their fieldwork research. Each student chooses a fieldwork supervisor who will permanently consult with them about their fieldwork experiences and research results.<br><br>Critical anthropological thinking and fieldwork experiences help the students understand the differences and difficulties of social interactions, cultural and intercultural communication and their significances in a sensitive and interpretative way.<br><br>Cultural knowledge is the basis of international communication and cooperation.<br><br>Using professional competencies acquired in the program, as fieldwork experience, practicing anthropological skills, interpretive thinking, inter-cultural mediation, the students will be able to apply their social and cultural anthropological knowledge and skills in decisions of the social and economic life, international relations and communication, as well as in their professional career.<br><br>The program places particular emphasis on the Central and Eastern European cultures, social questions and problems. Consequently, the students of the program have the chance to visit and research local communities, sub- and countercultural, ethnic, and minority groups in Hungary and the neighboring countries with their professors’ supervision.",
                        "tuitionFee": "3000",
                        "deadline": "31/05/2018",
                        "requirements": "Applicants must have a BA/BBA degree in any of the following areas: Social Science, Communication and Media Science, International Studies, Political Studies, Social Work, Sociology, Social Pedagogy, Cultural Anthropology, Political Science, Community Coordination, Ethnography, Roma Studies. In case of other bachelor degrees: individual consideration.",
                        "language": "Advanced English language knowledge",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 11
                    },
                    {
                        "courseName": "Doctoral School of Biology",
                        "description": "The Doctoral School of Biology founded in 2001 is the largest postgraduate biology program in the country, offering research-oriented training in a wide range of areas of modern biology. The main topics include theoretical and evolutionary biology, ethology, ecology, and conservation biology, molecular neurobiology, physiology, human biology, immunology, experimental plant science, cell biology, microbiology, molecular genetics and cell biology, structural biochemistry, taxonomy. The selection of courses covers both theoretical background and lab or field skills and experience. The training emphasizes practical skills: the majority of credits are earned with supervised research work under personal tutoring by leading researchers. Students are involved in collaborative research taking advantage of the collaboration networks within the institute and with international partner institutions. The aim of the training is to fully prepare students for a successful career in the life sciences: either in basic research or in the industry.<br><br>The program is strongly research-oriented: apart from attending specialized courses, the students start their research work well before the end of the first year. At the end of each year the students report about their research progress. Students are expected to publish at least two papers in peer-reviewed internationally renowned journals of their field.",
                        "tuitionFee": "2500 - 4500",
                        "deadline": "31/05/2018",
                        "requirements": "The successful applicant must have a M.Sc. in biology or chemistry, M.D., D.V. and a good command of English.",
                        "language": "A good command of English is required.",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "Doctoral",
                        "courselanguage": "English",
                        "credits": "240",
                        "courseID": 12
                    },
                    {
                        "courseName": "Doctoral School of Chemistry",
                        "description": "The PhD School of Chemistry was founded in 1993. The research fields covered by the School include practically the whole spectrum of chemistry, i.e., inorganic chemistry, physical chemistry, analytical chemistry, environmental chemistry, theoretical chemistry, organic and biochemistry, electrochemistry, structural chemistry, and polymer chemistry. The focus of the program is on research, students start to work on their chosen research topic, in the laboratory of the project leader, from the very beginning.<br><br>The students need to take eight courses during the first two years of the pogram. . The first two years of the program ends with a complex exam. By the end of the program most of the PhD students obtain results which are published (or accepted for publication) in internationally renowned, English-language journals. At least two such papers are necessary to obtain the PhD degree. The students report about their research progress during their study at annual conferences organized by the School.",
                        "tuitionFee": "2500 - 4500",
                        "deadline": "31/05/2018",
                        "requirements": "A master’s degree in chemistry (or in a related field) is a requirement.",
                        "language": "A reasonable command of English language is also needed.",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "Doctoral",
                        "courselanguage": "English",
                        "credits": "240",
                        "courseID": 13
                    },
                    {
                        "courseName": "Doctoral School of Earth Sciences",
                        "description": "Main research fields by the thematic programs of the ELTE Doctoral School of Earth Sciences:<br><br>    Geography (Physical Geography, Geomorphology, Environmental and Landscape Geography, Geography of Hungary and Central&Eastern Europe, Carpathian Basin, Human Geography, History of Geography, Ethnical Geography, Regional Science, Regional Planning, Urban Studies, Geoinformatics in Geography and Spatial Research)<br><br>    Meteorology (Dynamic and Synoptic Meteorology, Boundary Layer Meteorology, Climatology, Climate Modelling, Agroclimatology, Statistical Climatology)<br><br>    Geology and Geophysics (Physical and Applied Geology, Hidrogeology, Urban Geology, Petrology, Geochemistry, Mineralogy, Lithology, Paleontology, Volcanology, Sedimentology, Geophysics, Space Science, Geoinformatics in Earth Sciences)<br><br>    Cartography and Geoinformatics (Thematic Cartography, Mathematics in Cartography, Webcartography, History of Cartography, Toponymy, Geoinformatics in Cartography)<br><br>Theoretical courses, laboratory works, field studies.<br>Outcomes: publications, PhD thesis.",
                        "tuitionFee": "2500 - 4500",
                        "deadline": "31/05/2018",
                        "requirements": "A master’s degree in earth sciences or in a related field is a mandatory requirement.",
                        "language": "English C1<br>    Basic knowledge of the Hungarian language is an advantage.",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "Doctoral",
                        "courselanguage": "English",
                        "credits": "240",
                        "courseID": 14
                    },
                    {
                        "courseName": "Doctoral School of Education",
                        "description": "Our programme comprises of both course-based and research-based elements. The aim of the doctoral programme is to enable students to conduct research in accordance with the common national and international standards in pedagogy. Academic research competencies of students are to be developed in order to enable them to carry out solid research, write and defend dissertations, and be prepared for working in tertiary education or research centres. Therefore, the credits students have to earn during their studies are divided in the following proportion:<br>33% for courses, 5% for complex examination, 45% for academic research, and 17% for teaching in tertiary education.",
                        "tuitionFee": "4900",
                        "deadline": "25/05/2018",
                        "requirements": "Applicants are expected to present the documentation of their MA/MSc diploma with at least good average.<br><br>The Doctoral School of Education asks all applicants to contact the Person in Charge of the Programme. The list of them can be find the following link: http://www.ppk.elte.hu/en/programmes/doctoralpr/eduPhD/researcht<br><br>If the applicant is applying for the Language Pedagogy track, an entry requirement is a Master’s Degree in Language Pedagogy, although in exceptional cases a Master’s degree obtained in a closely related field (e.g. Applied Linguistics) may also be accepted.<br><br>For the Sports and Health Promotion Program: MA/MSc in education, pedagogy, teacher training, psychology, recreation, physical education teacher program, sports coach, sports manager, health educator, nutritionist, physiotherapist.<br><br>If the applicant takes their final examination during the current semester and their degree certificate (diploma) is not issued before the application deadline, a certification is required, which verifies that the applicant will presumably receive a degree. In case of being accepted as a student, however, the applicant must present the diploma upon enrolment at the latest.<br><br>This programme is not available for Hungarian citizens.",
                        "language": "The language of instruction for the entire programme is English, so a very good command of English is required during the oral entrance exam and throughout the whole programme. The language knowledge is assessed and evaluated during the interview.",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "Doctoral",
                        "courselanguage": "English",
                        "credits": "252",
                        "courseID": 15
                    },
                    {
                        "courseName": "Doctoral School of Environmental Sciences",
                        "description": "The Doctoral School offers doctoral training in the following directions in environmental sciences: environmental biology, environmental chemistry, environmental physics, or environmental geosciences. Emphasis is on the application of the given discipline in complex research projects, such as water quality changes and management, risk analysis and mitigation in various human and natural environments, renewable energy research, etc. The program offers training in up-to-date experimental methods and field exercises besides the solid theoretical background education.",
                        "tuitionFee": "2500 - 4500",
                        "deadline": "30/04/2018",
                        "requirements": "A master’s degree in science is a requirement.",
                        "language": "A reasonable good command of English is required.",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "Doctoral",
                        "courselanguage": "English",
                        "credits": "240",
                        "courseID": 16
                    },
                    {
                        "courseName": "Doctoral School of History",
                        "description": "The aims of the programs are to prepare students for obtaining their PhD degree through acquisition of latest research methodologies, participation in conferences and teaching expertise in higher education.<br><br>The Doctoral School of History offers doctoral studies in the following fields:<br><br>    Ancient History<br>    Archaeology<br>    Assyriology and Hebrew-Judaic Studies<br>    Atelier- European Social Sciences and Historiography<br>    Early Modern Hungarian History<br>    Economic and Social History<br>    History of the Ottoman Empire, Ottoman Rule in Hungary and the Republic of Turkey<br>    Medieaval Hungarian History<br>    Medieval and Early Modern World History<br>    Modern and Contemporary World History<br>    Modern Hungarian History",
                        "tuitionFee": "2200",
                        "deadline": "20/04/2018",
                        "requirements": "English level C1",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "Doctoral",
                        "courselanguage": "English",
                        "credits": "240",
                        "courseID": 17
                    },
                    {
                        "courseName": "Doctoral School of Informatics",
                        "description": "The aim is to give regular courses to students and prepare them for obtaining a scientific degree, and to offer them teaching experience in higher education. The objective is to train computer science and info-communication technology experts with professional knowledge based on solid theoretical background. The Doctoral School of Informatics provides PhD education in four doctoral programs:<br><br>    Information systems,<br>    Numeric and symbolic computations,<br>    Foundation and methodology of informatics,<br>    Informatics teaching methodology.",
                        "tuitionFee": "4500",
                        "deadline": "31/05/2018",
                        "requirements": "MSc degree and entrance examination",
                        "language": "An intermediate B2 type state-accredited language exam.",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "Doctoral",
                        "courselanguage": "English",
                        "credits": "240",
                        "courseID": 18
                    },
                    {
                        "courseName": "Doctoral School of Literary Studies",
                        "description": "The aims of the programs are to prepare students for obtaining their PhD degree through acquisition of latest research methodologies, participation in conferences and teaching expertise in higher education.<br><br>The Doctoral School of Literary Studies offers doctoral studies in the following fields:<br><br>    American Studies<br>    Comparative Literature<br>    French Literature from the Age of Enlightenment to the Present<br>    French Literature from the Middle Ages to the Age of Enlightenment<br>    Gender in English and American Literature and Culture<br>    Hungarian and Comparative Folklore<br>    Italian Literary and Cultural Studies<br>    Mediaeval and Early Modern English Literature and Culture<br>    Modern English and American Literature and Culture<br>    Russian Literature and Culture between East and West<br>    Russian Literature and Literary Studies: a Comparative Approach<br>    The Folklore and Literature of the Uralic Peoples<br>    The Hungarian Baroque",
                        "tuitionFee": "2200",
                        "deadline": "20/04/2018",
                        "requirements": "English level C1",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "Doctoral",
                        "courselanguage": "English",
                        "credits": "240",
                        "courseID": 19
                    },
                    {
                        "courseName": "Doctoral School of Mathematics",
                        "description": "At the Doctoral School of Mathematics founded in 2001 topics comprise most of pure mathematics, including also computer science, combinatorial optimization, statistical and mathematical physics, as well as most of applied mathematics including the full spectrum of operations research and statistics. A program in didactics of mathematics is also available. The program is research-oriented: apart from attending specialized courses, our students usually start their research work by the end of the first year. Thus by the end of the program most of them already obtain results which are published (or accepted for publication) in internationally renowned journals. At the end of each year the students report about their research progress. By the end of the second year of studies the students must pass a comprehensive examination.",
                        "tuitionFee": "2500 - 4500",
                        "deadline": "31/05/2018",
                        "requirements": "A master’s degree in mathematics (or in a related field) is a requirement.",
                        "language": "A reasonable command of English language is also needed (most international certificates will be accepted).",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "Doctoral",
                        "courselanguage": "English",
                        "credits": "240",
                        "courseID": 20
                    },
                    {
                        "courseName": "Doctoral School of Linguistics",
                        "description": "The aims of the programs are to prepare students for obtaining their PhD degree through acquisition of latest research methodologies, participation in conferences and teaching expertise in higher education.<br><br><br>The Doctoral School of Linguistics offers doctoral studies in the following fields:<br><br>    Ancient Studies<br>    Applied Linguistics<br>    English Linguistics<br>    Germanistische Linguistik<br>    Hungarian Linguistics<br>    Intercultural Linguistics<br>    Japanese Studies<br>    Mongolian Studies<br>    Romance Studies<br>    Russian Linguistics<br>    Theoretical Linguistics<br>    Translation Studies",
                        "tuitionFee": "2200",
                        "deadline": "20/04/2018",
                        "requirements": "English level C1",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "Doctoral",
                        "courselanguage": "English",
                        "credits": "240",
                        "courseID": 21
                    },
                    {
                        "courseName": "Doctoral School of Philosophy",
                        "description": "The aims of the doctoral programs are to prepare students for obtaining their PhD degree through acquisition of latest research methodologies, participation in conferences and teaching expertise in higher education.<br><br>The Doctoral School of Philosophy offers doctoral studies in the following fields:<br><br>    Aesthetics<br>    Analytic Philosophy<br>    Ancient and Mediaeval Philosophy<br>    Art History<br>    Film, Media and Culture Theory<br>    Logic and Philosophy of Science<br>    Modern Philosophy<br>    Phenomenology<br>    Religious Studies",
                        "tuitionFee": "2200",
                        "deadline": "20/04/2018",
                        "requirements": "English level C1",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "Doctoral",
                        "courselanguage": "English",
                        "credits": "240",
                        "courseID": 22
                    },
                    {
                        "courseName": "Doctoral School of Physics",
                        "description": "At the Doctoral School of Physics founded in 1994.<br><br>Research topics are organized in three thematic programs:<br><br>    Materials Science and Solid State Physics;<br><br>    Particle Physics and Astronomy; and<br><br>    Statistical Physics, Biological Physics and the Physics of Quantum Systems.<br><br>The program is research-oriented, the students start to work on their chosen topic under the guidance of a supervisor, immediately after enrolling in the program. In the first two years, students are required to attend 8 courses as well and complete the corresponding exams. In order to get the degree, students must have at least two papers published (or accepted for publication) in internationally renowned journals. The degree can be defended after 6 semesters, the earliest. The students should submit a short progress report  after each semester.<br><br>Research at the School is done in close collaboration with all major research institutes of the Hungarian Academy of Sciences (including Wigner Research Centre for Physics, Institute of Technical Physics and Materials Science, Research Centre for Astronomy and Earth Sciences, and Institute of Enzymology).",
                        "tuitionFee": "2500 - 4500",
                        "deadline": "31/05/2018",
                        "requirements": "Admission requirements: A master’s degree in physics or in a closely related field is a mandatory requirement. Applicants still pursuing their MSc studies should get their degree by the end of June 2018.",
                        "language": "A good command of English is essential. If English is not the applicant’s mother tongue, or if s/he hasn’t pursued her/his university studies in English, a language certificate proving at least B2, but preferably C1 level of proficiency is required. Only language examinations recognised by the Hungarian Accreditation Centre for Foreign Language Examinations are accepted (e.g.: IELTS).",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "Doctoral",
                        "courselanguage": "English",
                        "credits": "240",
                        "courseID": 23
                    },
                    {
                        "courseName": "Doctoral School of Psychology",
                        "description": "PhD Programme is intended for students that wish to pursue a research-oriented career in Psychology, students who interested in carrying out distinguished scholarly activities: have original, independent and critical thinking, and are able to develop of research-based knowledge in their selected fields of specialization. Students who are awarded Ph.D. degrees, are expected to have developed competence as teachers. Psychology PhD Programme provides you academic degree, promotes acquisition of advanced skills and abilities for academic research, and gives academic (teaching) practice.<br><br>There are currently six programmes running at the Doctoral School:",
                        "tuitionFee": "4900",
                        "deadline": "25/05/2018",
                        "requirements": "Applicants are expected to present the documentation of their MA/MSc diploma with at least good average.<br><br>If the applicant is taking their final examination during the current semester and their degree certificate (diploma) is not issued before the application deadline, a certification is required, which verifies that the applicant will presumably receive a degree. In case of being accepted as a student, however, the applicant must present the diploma upon enrolment at the latest.<br><br>This programme is not available for Hungarian citizens.",
                        "language": "The language of instruction for the entire programme is English, so a very good command of English is required during the oral entrance exam and throughout the whole programme. The language knowledge is assessed and evaluated during the interview.",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "Doctoral",
                        "courselanguage": "English",
                        "credits": "252",
                        "courseID": 24
                    },
                    {
                        "courseName": "Doctoral School of Sociology, Postgraduate Program of Sociology",
                        "description": "The aim of the program is to ensure the existence of a new generation of scientists dedicated to sociology and social sciences, their thorough preparation for acquiring the PhD qualification and  carrying out independent academic research and lecturing activities at a post-graduate academic level.",
                        "tuitionFee": "1150",
                        "deadline": "31/05/2018",
                        "requirements": "Students having an MA degree in any of the social sciences can apply. Applicants shall send in a list of publications as part of the application.",
                        "language": "A good command of English (minimum B2 level)",
                        "programType": "Full Time",
                        "courselength": "5 years",
                        "degreeType": "Doctoral",
                        "courselanguage": "English",
                        "credits": "240",
                        "courseID": 25
                    },
                    {
                        "courseName": "Educational Science MA",
                        "description": "The aim of this program is to train perfect professionals in the theoretical foundations and basic methods of educational sciences. Students will obtain an integrated knowledge of educational sciences and pedagogical practice, and neighbouring disciplines (philosophy, psychology, sociology, economy and law).  This program offers students in-depth knowledge for working at governmental authorities and companies, research institutions as well as for private companies, public administration, international organisations and non-governmental organisations (NGOs).",
                        "tuitionFee": "2900",
                        "deadline": "16/07/2018",
                        "requirements": "The language of instruction for the entire program is English, so a very good command of English is required during the oral entrance exam and throughout the whole program. The language knowledge is assessed and evaluated during the interview.",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 26
                    },
                    {
                        "courseName": "English Studies MA",
                        "description": "English is the lingua franca, the most important language for communication in the globalised 21st century. It is a fact of life that everywhere experts are needed who not only speak English correctly, but who are also familiar with the societies and cultures of those countries where English is the first language. Experience has shown that an extraordinarily large number of employers seek experts with not merely an excellent command of the language, but also with the ability to make good use of their knowledge of the English-speaking world. The transmission of such cultural knowledge is the foundation of tis program. <br><br>In this program, students become proficient in understanding and producing academic and media-oriented publications in the fields of English literature, socio-cultural history of the English language-based cultures (especially Great Britain, Ireland, Canada and Australia), applied and theoretical linguistics, mediating in English and their native language in specialised cultural, economic and political areas, teaching and transmitting knowledge concerning English literature and linguistics, and English language-based cultures and societies. <br><br>The program consists of the study of English Language, Linguistics, and Literature. Within this broad program of study, there are courses which a student must register for and attend as part of his or her degree program. There are also specializations tracks which give the student the opportunity to pursue his or her own, independent, in-depth research. A select few of the students graduating with an MA will have the opportunity to pursue PhD studies in English Linguistics or Literature either in Hungary or abroad. With a view toward preparing students to be future researchers, the English Studies MA program allows students to take courses in a wide variety of areas.",
                        "tuitionFee": "3500",
                        "deadline": "16/07/2018",
                        "requirements": "Online application form<br><br>    Relevant pages of the passport. Scanned, in color all personal details and expiry date must be shown. Passport must be valid.<br><br>    Proof of language proficiency. Official test result or certificate must be provided; see program specific proficiency requirements.<br><br>    An official copy of your completed secondary education (high school). Notarized copy only on request.<br><br>    Bachelor Degree. An official copy of your completed Bachelor degree.<br><br>    Academic records. Also called 'Transcript of records'.<br><br>    A Curriculum Vitae in English. In MS Word format with one low resolution photo.<br><br>    Research Proposal. Please consult with the coordinating department for more information.<br><br>    Letter of Reference. Also called 'Letter of recommendation.' From a former instructor and/or employer.<br><br>    Statement of Purpose in English. Also called 'Letter of Motivation.'<br><br>    Copy of application fee transfer. A bank slip showing that the application fee has been transferred to the University’s bank account.",
                        "language": "TOEFL PBT (Paper-based test): 550-583 or<br><br>    TOEFL IBT (Internet-based test): 79-93 or<br><br>    IELTS (International English Language Testing System): 6.5 or<br><br>    CEFR (Common European Framework of Reference): C1",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 27
                    },
                    {
                        "courseName": "Environmental Science MSc",
                        "description": "The Environmental Science MSc program is a complex interdisciplinary research module with environmental awareness.<br><br>Our courses are aimed at improving understanding of the environment and the processes that support life on Earth. We are particularly interested in the impacts of human activity in the world around us and in developing ready-to-use approaches for achieving environmental sustainability.<br><br>This program is recommended to applicants who want to apply 'green chemistry' approach and learn environmental technologies. The main goal is that environmental scientists can identify and address environmental impact assessment and environmental certification.",
                        "tuitionFee": "4190",
                        "deadline": "31/05/2018",
                        "requirements": "Relevant bachelor degree in any field of natural sciences. Applicants still pursuing their BSc studies should obtain the diploma, or at least a certificate of being entitled to the diploma, before starting their MSc studies.",
                        "language": "English exam at minimum intermediate (B2) level",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 28
                    },
                    {
                        "courseName": "Ethnic and Minority Policy MA",
                        "description": "The Ethnic and Minority Policy Master Program deals with minority issues and ethnic diversity in the region of Eastern and Central Europe with regard to the integration process of the countries of the region into the international community of the European Union. The serious ethnic conflicts of the region, the demand for countries to meet European norms in the area of minority issues, the increase in migration, and the simultaneous growth of xenophobia, anti-Semitism, and homophobia all contribute to a pressing need in Eastern and Central Europe for highly trained professionals who have the insight and expertise to identify the main political, social and psychological reasons behind tensions and discriminations and who are also equipped with the skills and techniques to handle and moderate these conflicts. Thus, it is a key function of the Program to provide the expertise necessary for this effort specifically in the European space. On the other hand, much of the research analyses, the scientific methods as well as the ‘Eastern and Central Europe experiences’ discussed in the Program have relevance also to those interested students who study ethnicity, race, and majority-minority relations elsewhere in the world.",
                        "tuitionFee": "3000",
                        "deadline": "31/05/2018",
                        "requirements": "TOEFL iBT: minimum overall score of 80 (at least 20 from each sections) or<br><br>    IELTS: minimum overall band score of 6.5 (at least 6.0 from each sections) or<br><br>    General and complex language exam of at least B2 level according to the system of Common European Framework of Reference for Languages: Learning, Teaching, Assessment",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 29
                    },
                    {
                        "courseName": "European and International Business Law LL.M. (part-time)",
                        "description": "This is the first LL.M in European and International Business Law in Hungary and it offers an in-depth education covering the complex legal environment of European and International economies.<br><br>The European and International Business Law LL.M is designed to prepare an international group of legal practitioners for the global challenges of the 21st century. The program combines state-of-the-art knowledge and skills with an international orientation. It will help to develop the participants' analytical as well as interpersonal skills in areas such as logical reasoning, argumentation and dispute settlement.<br><br>Integrating research and education at the Faculty into the European Higher Education Area and fostering international educational and scholarly ties are key components of our vision. At a time when globalization and European integration are on the agenda, an intercultural approach to law and its application, in other words, comparative legal studies are indispensable for a sound analysis of legal issues and the settlement of legal disputes. The course concept links theory to real world business. The high level curriculum offers solid grounding in the institutional fundamentals of the European economic integration and an introduction to international business law.<br><br>The goal of the program is to shape internationally renowned legal experts who are ready to take challenges in global scale and confident to handle complex issues in international regulatory environment with high level of confidence.",
                        "tuitionFee": "1000",
                        "deadline": "20/08/2018",
                        "requirements": "Applicants have to be in the possession of a Master level legal degree as this is a second master program.",
                        "language": "The required level of English language knowledge is minimum B2 according to the Common European Framework of Reference for Languages",
                        "programType": "Part Time",
                        "courselength": "1 years",
                        "degreeType": "",
                        "courselanguage": "English",
                        "credits": "60",
                        "courseID": 30
                    },
                    {
                        "courseName": "Film Studies MA",
                        "description": "The master’s program combining theoretical and practical knowledge allows students to deepen their basic knowledge acquired throughout the bachelor’s program in the field of film history, film analysis, film theory or practical skills. <br><br>The program includes two specializations: Film Theory Specialization and Filmmaking Specialization.<br><br>The Film Theory specialization offers a general overview on the history and theory of film, as well as critical understanding of the mechanisms and genres of popular film culture, with an emphasis on academic and critical writing. Students become familiar with the different periods of Hungarian and world film history, the different theoretical approaches of film studies and filmic genres, and develop their skills of reading theoretical texts and interpreting films. During consultations the faculty helps them to develop their research interests and to become committed specialists, who will be capable of pursuing an academic career. <br><br>The Filmmaking specialization is operated in cooperation with Budapest Film Academy and provides students up-to-date knowledge of different fields of the moving image industry. They get acquainted with the basic characteristics and writing of film scripts, the mechanisms and requirements of international film production and distribution, and get basic skills in directing, cinematography, and editing.",
                        "tuitionFee": "3500",
                        "deadline": "16/07/2018",
                        "requirements": "Non-native speakers of English must demonstrate sufficient English-language skills by taking the Test of English as a Foreign Language (TOEFL) exam. The minimum required score is 550 on the paper-based exam (PBT) or 80 on the Internet-based exam (iBT). We also accept IELTS exams with a score of 6 and above.",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 31
                    },
                    {
                        "courseName": "Foundation Course in English – General English",
                        "description": "The English Foundation Course (Preparatory Year) has been designed for students who wish to study at ELTE or another European university, but do not yet have the necessary level of language competence and study skills to start a BA degree program. With a minimum of 800 contact hours guaranteed, the course can bring you up to speed in as little as two semesters.<br> <br>The aim of the program is to provide a gateway for students to European education, where a good command of knowledge is required. The program equips students with the basic linguistic, cultural and study skills necessary for beginning BA level studies at a European university.",
                        "tuitionFee": "1490",
                        "deadline": "16/07/2018",
                        "requirements": "Attestation of 250 hours of English classes successully completed (no language exam is required).",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "Preparatory",
                        "courselanguage": "English",
                        "credits": "Not Available",
                        "courseID": 32
                    },
                    {
                        "courseName": "Geology MSc",
                        "description": "The program provides advanced training in geology, applicable to geological problem solving. Our graduates have a solid foundation of knowledge in the different core disciplines of geology sciences (mineralogy, petrology, geochemistry, and paleontology), complemented with advanced skills through specialized studies in selected areas. The field component includes a three-week geological mapping field school.<br><br>The program also has an emphasis on practical courses related to mineral exploration, petroleum geology, hydrogeology and environmental geology. The specialization in petroleum geology and/or hydrogeology provides in-depth training for future specialists in these fields. The degree program prepares both for continuing studies after admission to a doctoral program and work as a geologist primarily in the petroleum industry, in hydrogeology, or in related jobs in the public sector.",
                        "tuitionFee": "4190",
                        "deadline": "30/04/2018",
                        "requirements": "Applicants should possess a BSc degree in Geology (or Earth Sciences).",
                        "language": "Applicants should have an appropriate command of English, demonstrated either by IELTS score 5.0 or higher, TOEFL ITP score 500 or higher, or TOEFL IBT score 80 or higher.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 33
                    },
                    {
                        "courseName": "Health Policy, Planning and Financing (Specialization in Health Economics) MSc (full time)",
                        "description": "Our program is a unique initiative in Central and Eastern Europe: it offers basic knowledge similar to that in programs in Western Europe, but in addition it also prepares students to apply their knowledge and specific analytical skills in the context of middle-income countries.<br><br>The Specialization in Health Economics, launched in English, offers multi-disciplinary expertise and a problemoriented approach. Such knowledge and skills will remain relevant in the long run and help graduates understand and analyse key issues of future health systems, such as: efficiency of health technologies, sustainability of health financing, and techniques to measure and influence the performance of health care systems.<br><br>The Master Program enables graduates to understand the complexities of health care systems both at macro and micro levels and to perform tasks in analysis, planning, financing and management of health technologies, health care services and health systems. We expect applicants from foreign countries who would like to acquire state-of-the-art knowledge and skills in the areas mentioned above with a special focus on applicability in emerging markets. Foreign students studying at Hungarian medical universities may choose to combine their medical degree with the degree offered by our program. A master degree in English can also be an attractive option for Hungarian students, given increasing international co-operation in several areas of health care.",
                        "tuitionFee": "3000",
                        "deadline": "31/05/2018",
                        "requirements": "Applicants must have a BA/BBA degree in any of the following areas: social science, public health studies, health administration, health sciences, economics, business administration or a medical degree.",
                        "language": "Advanced English language knowledge",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 34
                    },
                    {
                        "courseName": "Health Policy, Planning and Financing (Specialization in Health Economics) MSc (part time)",
                        "description": "Our program is a unique initiative in Central and Eastern Europe: it offers basic knowledge just like otherprograms in Western Europe, but beside this, it also prepares students how to apply their knowledge and use specific analytical skills in the context of middle-income countries.<br><br>The Specialization in Health Economics, launched in English, offers multi-disciplinary expertise and a problem oriented approach. Such knowledge and skills will remain relevant in the long run and help graduates to understand and analyse key issues of future health systems, such as: efficiency of health technologies, sustainability of health financing and techniques to measure and influence the performance of health care systems.<br><br>The Master Program enables graduates to understand the complexities of health care systems both at macro and micro levels and to perform tasks in analysis, planning, financing and management of health technologies, health care services and health systems. We expect applicants from foreign countries who would like to acquire state-of-the-art knowledge and skills in the areas mentioned above with a special focus on applicability in emerging markets. Foreign students studying at Hungarian medical universities may choose to combine their medical degree with the degree offered by our program. A master degree in English can be an attractive option for Hungarian students as well, given the increasing international co-operation in several areas of health care.<br><br>The part-time program is especially tailored for those participants, who already have working experience and would like to further develop their knowledge and skills without giving up their working position.",
                        "tuitionFee": "3000 ",
                        "deadline": "31/05/2018",
                        "requirements": "Advanced English language knowledge",
                        "language": "Not Available",
                        "programType": "Part Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 35
                    },
                    {
                        "courseName": "Human Resources Counselling MA",
                        "description": "The aim of the program is to train experts, who, in possession of their human, economic and developed interdisciplinary approach, are able to make detailed analyses, to find global and special correlations and to carry out advising and assessing activities in the world of organisations, work, employment and education. They apply their professional skills, support the macro-level processes of human resource management and education according to the different professional requirements of the given workplace. They are able to identify special professional problems and define practical solutions to them. They provide help for individuals to make career planning decisions. Their advising activity is determined by their knowledge of the HR market and organisational processes. They are prepared to continue their studies in a PhD program.",
                        "tuitionFee": "1900",
                        "deadline": "16/07/2018",
                        "requirements": "Applicants must hold a university Bachelor’s degree (or an equivalent college degree) in the fields listed below, or a university Master’s degree:<br><br>Fully recognised BA studies (full credit acknowledgement): Andragogy and Community Management BA degree, college degree in Cultural Management, Human Resource Management, Labour Counselling, Pedagogy, Psychology, Human Resources, Sociology, Political Sciences, Computational Librarian, Cultural Anthropology and the BA degrees of teacher education. Bachelor Degree in Psychology, Education, Special Education, Sociology.  <br><br>Conditionally recognised BA studies: any Bachelor’s or Master’s degree program in case the applicant possesses 30 credits in the following fields: essential studies related to humanities: pedagogical, psychological, philosophical and ethical studies; adult education studies; communicational science related studies, communication development; information technology, library studies; essential studies related to social sciences: social studies, sociology, anthropology, political sciences; economic and legal studies. The condition of admittance is that the applicant should possess minimum 15 credits from these studies, the missing 15 can be obtained during the first semester of the applied program.<br><br>This program is not available for Hungarian citizens.<br><br>If the applicant takes their final examination during the current semester, and their degree certificate (diploma) is not issued before the last application deadline, a certification is required, which verifies that the applicant will presumably receive a degree. In case of being accepted as a student, however, the applicant must present the diploma upon enrolment at the latest.<br><br>The educational and outcome requirements are defined by the Ministry of Human Capacities (Regulation No. 18/2016. (VIII. 5.)) . The details of the application and admission process are defined by the Organisational and Operational Regulations of ELTE.",
                        "language": "The language of instruction for the entire program is English, so a very good command of English is required during the oral entrance exam and throughout the whole program. The language knowledge is assessed and evaluated during the interview.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 36
                    },
                    {
                        "courseName": "Hungarian BA",
                        "description": "The aim of the Hungarian BA program is to provide students a professional level of Hungarian in the language and its literature. The course offers the language training based on the experience of the Hungarian as a Foreign Language Department of Eötvös Loránd University, and also emphasises the importance of literary and cultural studies. Eastern, and Eastern-Central Europe are in the position to become central actors in cultural and economic connections between Asia and Europe. This can be seen as a developing trend that will grow in the coming years. Budapest, as the capital of Hungary is one of the hubs in the region and the centre of Hungarian culture. Students of the Hungarian BA program will specialize in Hungarian as a Foreign Language.",
                        "tuitionFee": "1500",
                        "deadline": "16/07/2018",
                        "requirements": "B2-level language certificate in Hungarian or Advanced level Hungarian “Matura” examination",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "LANG",
                        "courselanguage": "English",
                        "credits": "180",
                        "courseID": 37
                    },
                    {
                        "courseName": "Intensive Hungarian Foundation Course",
                        "description": "The Intensive Hungarian Foundation Course designed to anyone interested in the Hungarian language and culture is the ideal way to jump-start your future academic or professional life in Hungary.<br> <br>Divided into two terms, the aim of the course is to provide students with a system of tools allowing them to successfully manage communicational situations arising in the target language environment and enabling them to comprehend factual texts containing the basic structures of the language, in both reading and writing.<br><br>In the second semester, students are provided with the full formal system of the Hungarian language. The course subjects, aimed at developing the various language skills, now concentrate on, among other things, independent written compositions and language use for expressing opinions. The reading program gradually leads from comprehending texts with the help of a dictionary up to the independent processing of texts. The latter subjects can be expanded by developing the basic vocabulary according to the students’ wishes into various study areas, such as history, literature, sociology.<br><br>Apart from the intensive language classes, the additional Hungarian cultural lectures give an overview of the main events in Hungarian history, Hungarian literature, linguistics, folklore, cultural history and sociology. These lectures are held in English. <br><br>This two-semester program provides students with the necessary skills and knowledge that enables them to continue studies in Hungarian at a university level or to use Hungarian as an intermediary language at work.",
                        "tuitionFee": "1490",
                        "deadline": "16/07/2018",
                        "requirements": "Attestation of approximately 320 hours of English classes successfully completed (CEFR: B2). No formal proof of language proficiency is required.",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "Preparatory",
                        "courselanguage": "English",
                        "credits": "Not Available",
                        "courseID": 38
                    },
                    {
                        "courseName": "International Relations BA",
                        "description": "Our Bachelor degree in International Relations offers students the opportunity to develop specialized knowledge in international politics, security studies, EU politics, ethnic conflict, global justice and human rights. It enables them to understand and analyze complex political and social dynamics that go beyond state borders and cultural boundaries. The structure of the program offers the opportunity for students – following introductory courses in the first year – to choose from a wide range of elective seminars.",
                        "tuitionFee": "2400",
                        "deadline": "31/05/2018",
                        "requirements": "Certificate of Secondary Education, (least one subject in high level)",
                        "language": "Minimum level of language proficiency (oral) B2",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "180",
                        "courseID": 39
                    },
                    {
                        "courseName": "International and European Taxation Program for Economists (part-time)",
                        "description": "The modern and progressive syllabus is designed to give the students the knowledge necessary to understand the ongoing tax issues of the world we live in. Our teaching staff ensure a well-balanced education in terms of theory and practice. The program runs in co-operation with outstanding European lecturers such as  Prof Dr. Frans Vanistendael (honorary professor of ELTE Law, former academic chairman of IBFD, former dean of KU Leuven Belgium) Prof. Dr. Ekkehart Reimer (Heidelberg University Institute of Public Finance and Tax Law) , Prof. Dr. Marco Greggi (Ferrara University Department of Law), Prof. Dr. Niels Bammens (KU Leuven Belgium),  PD Dr. Matthias Valta (acting professor Düsseldorf University) and Dr. Daniel Varro (Post doc University Assistant University of Vienna).<br><br>The program enjoys the advantages of being established in association with the market leader tax advisor companies. Top managers and partners of Hungarian Big4 provide the students with practical issues. Balazs Szuk (manager, PwC), Dr. Attila Kövesdy (Partner In Charge Tax & Legal Deloitte Co. Ltd.), Zoltan Farkas (director, KPMG), Miklos Santa (partner, EY).<br><br>High representative of the judiciary, chief justice Dr. Peter Darak (president of the Supreme Court of Hungary), furthermore representatives of the tax authority and government (Agnes Fotiadi and Robert Csabai), raise the quality of the programme.<br><br>Lecturers of ELTE Law also contribute to the education. Among many others Dr. Reka Somssich (vice-dean) and Dr. Istvan Simon (Head of Department of Fiscal Law) and Dr. Gabor Kajtar, Dr. Gabor Kecso, Dr. Monika Papp, Dr. Zsolt Szatmari (lecturers of ELTE) represent ELTE Law.<br><br>Thanks to the remarkable and diverse experience of our teaching staff, the program is close to the need of the market, meanwhile it is grounded by massive analytical and theoretical background.",
                        "tuitionFee": "1000",
                        "deadline": "20/08/2018",
                        "requirements": "Applicants have to be in the possession of a Bachelor level economist degree.",
                        "language": "The required level of English language knowledge is minimum B2 according to the Common European Framework of Reference for Languages",
                        "programType": "Part Time",
                        "courselength": "1 years",
                        "degreeType": "Legal Expert",
                        "courselanguage": "English",
                        "credits": "60",
                        "courseID": 40
                    },
                    {
                        "courseName": "International and European Taxation Program for Lawyers LL.M. (part-time)",
                        "description": "The modern and progressive syllabus is designed to give the students the knowledge necessary to understand the ongoing tax issues of the world we live in. Our teaching staff ensure a well-balanced education in terms of theory and practice. The program runs in co-operation with outstanding European lecturers such as  Prof Dr. Frans Vanistendael (honorary professor of ELTE Law, former academic chairman of IBFD, former dean of KU Leuven Belgium) Prof. Dr. Ekkehart Reimer (Heidelberg University Institute of Public Finance and Tax Law) , Prof. Dr. Marco Greggi (Ferrara University Department of Law), Prof. Dr. Niels Bammens (KU Leuven Belgium),  PD Dr. Matthias Valta (acting professor Düsseldorf University) and Dr. Daniel Varro (Post doc University Assistant University of Vienna).<br><br>The program enjoys the advantages of being established in association with the market leader tax advisor companies. Top managers and partners of Hungarian Big4 provide the students with practical issues. Balazs Szuk (manager, PwC), Dr. Attila Kövesdy (Partner In Charge Tax & Legal Deloitte Co. Ltd.), Zoltan Farkas (director, KPMG), Miklos Santa (partner, EY).<br><br>High representative of the judiciary, chief justice Dr. Peter Darak (president of the Supreme Court of Hungary), furthermore representatives of the tax authority and government (Agnes Fotiadi and Robert Csabai), raise the quality of the program.<br><br>Lecturers of ELTE Law also contribute to the education. Among many others Dr. Reka Somssich (vice-dean) and Dr. Istvan Simon (Head of Department of Fiscal Law) and Dr. Gabor Kajtar, Dr. Gabor Kecso, Dr. Monika Papp, Dr. Zsolt Szatmari (lecturers of ELTE) represent ELTE Law.<br><br>Thanks to the remarkable and diverse experience of our teaching staff, the program is close to the need of the market, meanwhile it is grounded by massive analytical and theoretical background.",
                        "tuitionFee": "1000",
                        "deadline": "31/05/2018",
                        "requirements": "",
                        "language": "",
                        "programType": "Part Time",
                        "courselength": "1 years",
                        "degreeType": "Master in Laws",
                        "courselanguage": "English",
                        "credits": "60",
                        "courseID": 41
                    },
                    {
                        "courseName": "Logic and Theory of Science MA",
                        "description": "This program focuses on logic and its applications in the philosophy of science, particularly in the foundations of mathematics, physics, linguistics, and the social sciences. Beyond a few core courses and a joint four-semester seminar series providing a common background to all students, we offer the following four thematic groups of courses: Logic and the Philosophy of Mathematics, Foundations of Physics, Logic in Linguistics, and Models in the Social Sciences.<br><br>In general, the program is research oriented, aiming to prepare students for a doctoral program. The program aims at developing research abilities of the students. Its central part is the Logic and its Applications Seminar at the Department of Logic, where students and staff members together discuss their work in progress. The most often occurring topics of the seminar are set theory and model theory in their philosophical connections, philosophy of mathematics in general, formalisation of physical theories, such as special and general relativity within different logical frameworks. Students get acquainted with the research works of the staff of the department and its partner and join a research program in order to write their own thesis. They are required to give two presentations of their work during the two years.",
                        "tuitionFee": "2200 ",
                        "deadline": "16/07/2018",
                        "requirements": "English - intermediate (approximately C1-level CEFR)",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 43
                    },
                    {
                        "courseName": "Master in European Human Rights LL.M. (part-time)",
                        "description": "Human Rights have become a significant part of the legal order of the European Union, accompanied with an ever growing social need for better protection. Internationally agreed human rights principles and standards now also increasingly influence economic policy formation.<br><br>Constantly ranked in the top tier of Law Schools in Central-Europe, the Faculty of Law, ELTE launches a program in European Human Rights to bring together leading scholars, lawyers and policy makers. Starting from 2016 September, our European Human Rights program focuses on complex and creative problem solving in the field of human rights law and wishes to enable students to take new approaches in human rights litigation on various European fora.<br><br>Globalisation has prompted interest in deepening understanding of the relationship between human rights and traditional areas of law. Important efforts have already been made by various international organisations to disentangle the links between ethics, human rights, development and economics.<br><br>Human rights advocates can bring rights-based approach not only to strive for higher level protection, but also to bring about better economic and developmental results, thereby instrumentalising human rights values and concepts.<br><br>The goal of the program is to shape internationally renowned legal experts who are ready to take challenges in global scale and confident to handle complex issues in international regulatory environment with high level of confidence.",
                        "tuitionFee": "1000",
                        "deadline": "20/08/2018",
                        "requirements": "The required level of English language knowledge is minimum B2 according to the Common European Framework of Reference for Languages.",
                        "language": "Not Available",
                        "programType": "Part Time",
                        "courselength": "1 years",
                        "degreeType": "Master in Laws",
                        "courselanguage": "English",
                        "credits": "60",
                        "courseID": 44
                    },
                    {
                        "courseName": "Mathematics MSc",
                        "description": "The program gives a comprehensive knowledge of several areas in mathematics and introduces the students into doing research in theoretical and/or applied mathematics. Besides purely theoretical courses, many courses are application oriented. Courses are offered in algebra, number theory, real and complex analysis, topology, geometry, probability theory and statistics, discrete mathematics and operations research but also in such interdisciplinary subjects as bioinformatics and theoretical computer science. The students may also choose from high-level application-oriented courses, which present state of the art issues of the given area, like complex systems, financial mathematics etc.",
                        "tuitionFee": "4190",
                        "deadline": "15/06/2018",
                        "requirements": "BSc degree in Mathematics or in a related field (Physics, Computer Science, Engineering, etc.) in the latter case at leat 65 credits in Mathematics is required.",
                        "language": "English language proficiency test (almost any test is accepted)",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 45
                    },
                    {
                        "courseName": "Mechanical Engineering BSc",
                        "description": "The objective is to train mechanical engineers with a professional knowledge based on a solid theoretical knowledge and industrial background. They have the skills to take part in designing simple machines or machine elements, use Computer Aided Engineering (CAE) tools, operate and develop complete production chains in various engineering fields. Mechanical Engineers must have a general problem-solving attitude while also need to be able to participate in teams of large-scale projects.<br><br>The program provides students with a broad education in Mechanical Engineering in specialized in Production Technologies. The education program involves strong fundamental subjects as Applied Solid- and Fluid Mechanics together with cutting-edge computational tools such as Computer Aided Design (CAD) Computer Aided Engineering (CAE), Finite Element Methods (FEA) or Multibody Dynamics (MD). Students learn the theory as well as the methodologies and techniques in the development and implementation of engineering systems and structures. The more practical courses are aided by state-of-the-art laboratories like the Laboratory of Materials Sciences, the Laboratory of Production Technologies or the Control Technique Laboratory.",
                        "tuitionFee": "3000",
                        "deadline": "16/07/2018",
                        "requirements": "A proof of at least Intermediate level English language skills is required (secondary school grades are sufficient, language exams are preferred).",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "3.5 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "210",
                        "courseID": 46
                    },
                    {
                        "courseName": "Meteorology MSc",
                        "description": "In this program we train future meteorologists who will have appropriate atmospheric oriented scientific viewpoint and high level of theoretical and practical knowledge by the end of the program. They will have the skill set to be able to apply the practice, measurement and observation-oriented analysis methods, as well as the knowledge for weather forecasting and climate modelling. They will also obtain scientifically based meteorological and environmental viewpoint. Depending on their ambitions they will be able to continue their studies in a PhD program.<br><br>The courses are divided into two parts. Students have compulsory courses covering general meteorology fields required for everybody (e.g., advanced mathematics, fluid dynamics, dynamical meteorology, informatics, climatology, synoptical meteorology, environmental protection and numerical modelling). By the end of the first semester, the students have to choose a specialization: weather forecaster or climate researcher.<br><br>The specialization will cover 30 credits of compulsory classes in the next three semesters. The courses for the specializations cover the full spectrum of the selected field. Students with missing background in a particular field of meteorology are required to fulfil prescribed BSc classes up to 20 additional credits. The master thesis work is taken into account as 20 credits.",
                        "tuitionFee": "4190",
                        "deadline": "31/05/2018",
                        "requirements": "Applicants should possess a BSc degree in Meteorology (or equivalent) and an appropriate command of either the English or the Hungarian language<br><br>BSc courses attended should – by all means – include:<br><br>    Mathematics (Basic, Analysis, Partial Differential Equations, Probability and Statistics) worth at least 12 credits,<br>    Physics (Basic, Mechanics, and Thermodynamics) worth at least 12 credits,<br>    Informatics (Numerical Methods, Programming, Data Processing) worth at least 6 credits,<br>    Meteorology (Basic, Climatology, Dynamic Meteorology, Synoptic Meteorology, Atmospheric Physics, Atmospheric Chemistry, Applied Climatology) worth at least 10 credits<br>    Optional Earth Sciences (general astronomy, geography, geophysics, geology and cartography) worth maximum 10 credits. <br><br>One-third of the missing courses can be completed during the MSc studies as additional courses.",
                        "language": "The successful applicant must have a good command of English. Several kind of internationally respected certificate of English language at advanced level is accepted.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 47
                    },
                    {
                        "courseName": "Physics MSc",
                        "description": "The Physics MSc program offers both the development of a broad background in the major fields of physics (atomic and molecular physics, condensed matter physics, nuclear physics, particle physics, statistical physics), and the specialization in selected areas (atomic and molecular physics, astrophysics, biophysics, condensed matter physics, computational physics, environmental physics, particle physics, statistical physics and complex system). The types of courses taken by the students include lectures, problem solving courses, student seminars, laboratory work, and a research project supervised by an expert in the field.<br><br>The knowledge obtained in the M.Sc. program forms an excellent basis for further Ph.D. Studies. The curriculum is assembled from intensive advanced level courses on the theoretical aspects of selected disciplines and special seminar series on problems in a narrower field of physics.",
                        "tuitionFee": "4190",
                        "deadline": "31/05/2018",
                        "requirements": "A good working knowledge of English is required.",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 48
                    },
                    {
                        "courseName": "Pre-Medical – English for Specific Purposes Training",
                        "description": "Interested in pursuing a degree at one of Europe’s many worldclass universities, but in need of the required qualifications? The English for Academic Purposes Training (EAP) programs combine the development of academic skills in the English language with field-specific knowledge, preparing you for a smooth entrance into a bachelor’s program at ELTE or a university outside of Hungary. The EAP programs will allow you to reach B2-level language proficiency (CEFR) in just one year.",
                        "tuitionFee": "2000",
                        "deadline": "16/07/2018",
                        "requirements": "Attestation of 320 hours of English classes successfully completed (no language exam is required).",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "Preparatory",
                        "courselanguage": "English",
                        "credits": "Not Available",
                        "courseID": 49
                    },
                    {
                        "courseName": "Psychology BA",
                        "description": "The aim of the ELTE psychology BA program is to train professionals who are perfect in the theoretical foundations and basic methods of psychology, have an insight into the applied branches of psychology and possess skills and techniques that can be used in order to measure, explore and develop individuals, groups or organizations through behaviour measurement or other experiments. Students will obtain an integrated knowledge of education, communication, socialization, learning and human development. It is also aimed to provide modern, both theoretical and practical knowledge and true sense of vocation that support further learning in any psychology MA.<br><br>Accordingly, the curriculum underlines the importance of theoretical knowledge and the regular syllabus of the profession of psychology, therefore it teaches the methodology and the practical courses eligible to master the main applied branches and the trainings that shape the skills and competences necessary for the behaviour analysis separately and supports it with high credit volume. Next to the basic courses and the regular syllabus the curriculum also offers further special courses to help their detailed understanding. One can choose from them in order to decide in which practical field the student wants to become familiar with or more deeply engaged in.<br><br>The methodically demanding research papers compiled in the fields of the basic branches substantiate the final dissertation, which is in fact a portfolio of the empirical findings of these research papers, but with a methodical completion of an individually chosen one with further introduction into practical applications.<br><br>The final examination consists of the defence and discussion of the research papers. Students are required to place their research papers within the broader context of their studies in psychology. Special emphasis will be given to the methodological skills and appropriate use of statistical methods acquired by the student.",
                        "tuitionFee": "4200",
                        "deadline": "16/07/2018",
                        "requirements": "The students who can apply for the BA in Psychology Program are expected to present the documentation of their certificate of matriculation from a secondary school and to submit their application with the necessary attachments.<br><br>The university accepts only certificates, which are equivalent to the Hungarian certificate of matriculation, thus appropriate for continuing one’s studies in university education. If the certificate is not in English, the university needs an official translation, which could be a translation by the secondary school as well. <br><br>If the applicant completes their secondary education during the current term and their certificate is not issued before the application deadline, a proof of student status or a certification, which verifies that the applicant will receive matriculation is required instead. In case of being accepted as a student, however, the applicant must present their certificate of matriculation upon enrolment at the latest.<br><br>This program is not available for Hungarian citizens.<br><br>The educational and outcome requirements are defined by the Ministry of Human Capacities (Regulation No. 18/2016. (VIII. 5.)) . The details of the application and admission process are defined by the Organisational and Operational Regulations of ELTE",
                        "language": "The language of instruction for the entire program is English, so a very good command of English is required during the oral entrance exam and throughout the whole program. The language knowledge is assessed and evaluated during the interview.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "180",
                        "courseID": 50
                    },
                    {
                        "courseName": "Psychology MA",
                        "description": "The aim of the program is to train psychologist professionals who master the theories and methods of the science of psychology at an advanced level, who are proficient in the various fields of psychology, who possess the skills and techniques of the psychologist profession and are able to apply these to help individuals, groups or organizations develop and improve.<br><br>Further aims are to present recent theoretical and practical material, to establish professional skills and commitment for the profession within the field of psychology at a level that gives a solid foundation of knowledge that enables the student to practice psychology as a vocation independently at a master level, to participate in postgraduate courses and to attend further training in doctoral schools.<br><br>A master of psychology is characterized by expansive and integrated professional and theoretical knowledge, the creative adaptation of the methods of academic knowledge, psychological responsiveness and communicational efficacy through the utilization of personal resources along with a high degree of professional commitment.",
                        "tuitionFee": "4200",
                        "deadline": "16/07/2018",
                        "requirements": "Applicants must hold a Bachelor’s degree in Psychology or Psychology-related Sciences. However, full credit acknowledgement is given only for a Bachelor’s degree in Psychology. In the case of a Psychology-related Sciences degree, each degree will be considered individually, and transcripts from your Bachelor's degree as well as course descriptions will be requested.<br><br>If the applicant takes their final examination during the current semester, and their degree certificate (diploma) is not issued before the last application deadline, a certification is required, which verifies that the applicant will presumably receive a degree. In case of being accepted as a student, however, the applicant must present the diploma upon enrolment at the latest.<br><br>This programme is not available for Hungarian citizens.<br><br>The educational and outcome requirements are defined by the Ministry of Human Capacities (Regulation No. 18/2016. (VIII. 5.)) . The details of the application and admission process are defined by the Organisational and Operational Regulations of ELTE.",
                        "language": "The language of instruction for the entire programme is English, so a very good command of English is required during the oral entrance exam and throughout the whole programme. The language knowledge is assessed and evaluated during the interview.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 51
                    },
                    {
                        "courseName": "Romance Philology, Specialized in Romanian BA",
                        "description": "The main goal of the program is to ensure a good knowledge of the Romanian language and literature. BA level provides a thorough training in order to be able to apply forward at Master level. The program also emphasis the practical training so that those who graduate it will have the chance to engage in the competitive sphere/ labor market (translator, editor, publisher, etc.)",
                        "tuitionFee": "1500",
                        "deadline": "16/07/2018",
                        "requirements": "Romanian: DELF B1",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "180",
                        "courseID": 52
                    },
                    {
                        "courseName": "Romanian Language, Literature and Culture MA",
                        "description": "The main goal of the program is to ensure a good knowledge of the Romanian language and literature. BA level provides a thorough training in order to be able to apply forward at PhD level. The program also emphasis the practical training so that those who graduate it will have the chance to engage in the competitive sphere/ labor market (translator , editor , publisher , etc.)",
                        "tuitionFee": "2200",
                        "deadline": "16/07/2018",
                        "requirements": "Romanian: DELF B2",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 53
                    },
                    {
                        "courseName": "Semiotics MA",
                        "description": "Semiotics is an ancient discipline with a long history, which has gained a firm theoretical foundation during the 19th century and an ever growing significance over the last 50 years. This discipline is now in a period of very intensive, concentrated research and self-identification on the map of contemporary science.<br> <br>The interdisciplinary Semiotics MA program at ELTE educates students to become well-trained specialists in semiotics of culture with a global overview of the various fields of humanities: literary studies, linguistics, philosophy, visual arts and general art studies – including approaches to fine arts, films, theatre and music – and also the most contemporary methods of research synthetized from a semiotic methodological point of view. At the same time, choosing the specific field for diploma work students can gain specialized knowledge in one subfield of the semiotics of humanities (e.g., literary, visual, musical, theoretical semiotics, and ethnosemiotics ).<br><br>The program is designed to be flexible to motivate students to find the best Hungarian specialists in the given field and assist them to become involved in international research and dialogues with foreign scholars and lecturers. The curriculum consists of courses on the history and theory of semiotics; language, communication, texts and translation; theory of meaning, logic, argumentation; field studies of cultural, national and special semiotic systems; various forms of applied semiotics and semiotic pragmatics in general. The program also lays emphasis on the preparation of students for PhD studies to plan their research career.",
                        "tuitionFee": "2200",
                        "deadline": "16/07/2018",
                        "requirements": "Your knowledge of English must be at a good level in reading, listening and speaking. English is the working language of the MA program (C1 level preferred).",
                        "language": "Not Available",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 54
                    },
                    {
                        "courseName": "Social Integration MA",
                        "description": "Multi/intercultural issues have become increasingly significant in political, social, cultural and everyday life. This is due to processes related to globalization, to continuous social changes and to the changing cultural and educational scene. Cultural awareness has thus become an essential part of being a professional in most fields but it is truly indispensable in community work and education. To meet the need for experts in these fields, the Institute of Intercultural Psychology and Education (IIPE) of the Eötvös Loránd University, Budapest launched its first MA Program of Intercultural Psychology and Education in 2009. This is a 4-semester program with 120 credits. From September, 2013, the Program has been offered in English as well for students from various regions of the world. From September 2017, the program has been renamed to MA program in Social Integration.<br><br>The Program provides students with knowledge about the multifaceted nature of intercultural issues and multi/interculturalism by means of a multidisciplinary approach, which includes anthropology, sociology, psychology and education. The Program is both theory-based and practice oriented. Courses are based on latest researches in relevant fields, and students are given opportunities to test and apply their theoretical knowledge in practical situations. Approximately half of the Program consists of trainings, seminars, and field work. The Program prepares students to understand, and effectively work with, culturally diverse populations in different institutions and in different settings, ranging from small communities to multinational corporations. With their sound knowledge and competences in intercultural psychology and education, graduates from the Program will be able to consciously treat the diversity of values in different societies, helping to promote social equity, human rights, social integration and cooperation of different minority and majority groups. Graduates with intercultural knowledge and skills will support the integration of minorities – particularly that of Roma, disadvantaged groups, migrants and refugees. They will also help the training and the mobility of people in the international labor market and promote equality of opportunities for members of disadvantaged groups. Completing the Program, the students will be prepared to pursue doctoral studies.",
                        "tuitionFee": "2900",
                        "deadline": "16/07/2018",
                        "requirements": "Fully recognised studies: Bachelor Degree in Psychology, Education, Special Education, Sociology.<br><br>In the case of degrees gained on other fields except for the mentioned ones above, each degree will be considered individually, and transcripts from your Bachelor's degree as well as course descriptions will be requested.<br><br>If the applicant is taking their final examination during the current semester, and their degree certificate (diploma) is not issued before the last application deadline, a certification is required, which verifies that the applicant will presumably receive a degree. In case of being accepted as a student, however, the applicant must present the diploma upon enrolment at the latest.<br><br>This program is not available for Hungarian citizens.<br><br>The educational and outcome requirements are defined by the Ministry of Human Capacities (Regulation No. 18/2016. (VIII. 5.)). The details of the application and admission process are defined by the Organisational and Operational Regulations of ELTE.",
                        "language": "The language of instruction for the entire program is English, so a very good command of English is required during the oral entrance exam and throughout the whole program. The language knowledge is assessed and evaluated during the interview.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 55
                    },
                    {
                        "courseName": "TEMA+ European Territories: Heritage and Development",
                        "description": "The TEMA+ is a renewed and developed version of the TEMA European Territories: Identity and Development Erasmus Mundus Joint Master Degree (EMJMD), cofounded by the Erasmus+ Erasmus Mundus programme. The TEMA+ is coordinated from ELTE, in cooperation with the European Heritage Label (EHL) and different UNESCO organs.<br><br>The TEMA+ Consortium formed by the ELTE, the École des Hautes en Sciences Sociales in Paris (EHESS), the University of Catania (UNICT), the Charles University, Prague (CUNI) is now joined by a new non-European partner university too: the Laval University from Canada (UL).<br><br>The Consortium recognized a need for a master's degree programme training students to become experts and scholars of European Heritage, in order to create a better and more solid theoretical, conceptual, and practical basis of the efforts of the European Heritage Label and UNESCO. For this reason, the consortium has commonly decided to use its expertise to develop a new interdisciplinary programme and curriculum and to create the first European joint master programme on European Heritage Studies that connects the academic fields of Social Sciences and Humanities. Thus, the TEMA+ wishes to provide better understanding of the growing presence and importance of cultural heritage in a European context by applying a multinational, interdisciplinary approach.<br><br>The mobility tracks of the students are divided among the coordinating institution (Semester 1) and the four partner universities (CUNI, EHESS, UNICT, UL) for Semester 2-3, during which they do an obligatory internship at the associated members of the Consortium. Finally, a chosen individually mobility follows for Semester 4 (among the five HEI), during which students have to write their Master thesis. The Consortium awards the students with double or multiple degrees, all accredited on national level in the field of European Cultural Heritage (MA degrees in Social Sciences and Humanities).<br><br>The TEMA+ offers not only a unique international atmosphere, but also prestigious Erasmus Mundus scholarships for the most outstanding European and non-European students. The Erasmus Mundus scholarships include student participation costs, a contribution to student travel and installation cost and a subsistence allowance (1 000 EUR per month) for the entire duration of the EMJMD study programme.",
                        "tuitionFee": "3000",
                        "deadline": "31/05/2018",
                        "requirements": "Entry requirements<br><br>Note: The same admission requirements apply to European and third country students.<br><br>The selection is based on academic excellence and proficiency in English and in French.<br><br>Degree requirements:<br><br>The TEMA+ Erasmus Mundus Joint Master Course accepts candidates with various academic backgrounds and degrees (BA/MA, eventually PhD), and is dedicated to foster lifelong learning. The TEMA+ welcomes students at Master level who have obtained a first higher education degree, a master’s degree or demonstrate a recognised equivalent level of learning according to national legislation and practices in the degree awarding countries.<br><br>The TEMA+ is open to excellent Programme and Partner Country students having acquired a first degree (BA/BSc /180 ECTS/) or a master’s degree (MA/MSc/120 ECTS) in History, Geography, Philosophy, Anthropology, Ethnography, Sociology, Cultural Studies, Urban Studies, Nationalism Studies, International Relations, Law, Economy, Administration, or related fields.<br><br>In case of obtaining the diploma only after the deadline of application, it is possible to send its certified copy later. Nevertheless, in this case, the candidate has to provide in the application package an official certificate from his / her university testifying the studies and also has to indicate the precise date of getting the diploma. The same rules apply for language test results.<br><br>Research topic:<br><br>The applicant has to choose a research subject in accordance with the TEMA+ Erasmus Mundus Joint Master Course's curriculum. Possible research themes are indicated on the website of TEMA+ www.mastertema.eu .<br><br>Work experience:<br><br>No work experience is required for admission to TEMA+ EMJMD. However, professional experience in a field related to the Master Course is an asset.",
                        "language": "As the TEMA+ EMJMD is provided in English and in French, proficiency in these languages is a must. To apply, the candidates must dispose of a language certificate of both from English and French: one of them must be of an advanced level and the other may be of a more elementary level, which can be also set out by the candidate's university or department. The level of English proficiency should be at least C1, using the Common European Framework of Reference for Languages scale. The following English language tests are accepted: TOEFL, IELTS, Cambridge. The level of knowledge in French language should be above B1. The following language tests are accepted: DELF, TCF.<br><br>The TEMA+ Consortium does not require a language test certificate from applicants:<br><br>    Whose native language is either English or French,<br>    Holding a diploma/degree delivered by a college, high school or higher education institution (such as A levels, baccalaureate, BA/BSc etc.) in which the language of instruction is English or French,<br>    Who have FLE (teaching French as a foreign language) or TEFL (teaching English as a foreign language) qualification.<br><br>Applicants holding a certificate in English or in French that is nationally recognized in their country must request a validation of it by the TEMA+ Secretariat. However, national certificates must be at least of advanced level and evidence the holder's both oral and written skills. Knowledge of other European languages, especially Italian, Czech or Hungarian is an asset.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "Erasmus Mundus joint degree program",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 56
                    }
                ]
            },
            {
                id: "2",
                "universityname": "Budapest Metropolitan University",
                "aboutUniversity": "Budapest Metropolitan University is an accredited private institute of higher education in Budapest, Hungary. It is formally known as the BKF University of Applied Sciences or Budapest Metropolitan University of Applied Sciences.",
                "generalRequirement": "Not Available",
                "data-keyword": "",
                "country": "Hungary",
                "student_payment": false,
                "application_url": "https://apply.metropolitan.hu/applicant/register",
                "email":"international@metropolitan.hu",
                "campusImgUrl": "",
                "universityProfilePic": "metropolitan",
                "skypeID": "",
                "examinationPortal": "",
                "universityAddress": "",
                "universityLogo": "images/metropolitan-logo.png",
                "visibility": "show",
                "courses": [{
                        "courseName": "Communication and Media Science BA",
                        "description": "Communication and the media have become an integral part of our everyday life. They are not only indispensable for work but they play an essential role in almost every activity imaginable. The latest developments in technology provide an opportunity for an immediate reaction to any event.<br>Therefore, new applications, such as Web 2.0 based technology, are of paramount importance for us. Our aim is to transfer the in-depth knowledge and skills needed to understand and master the constantly evolving tools of communication in a spirit that enables graduates to use the novel means of communication and the media in a responsible way preparing students to face any future challenge.",
                        "tuitionFee": "2300",
                        "deadline": "30/07/2018",
                        "requirements": "High school diploma",
                        "language": "IELTS min. 5,5",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 0
                    },
                    {
                        "courseName": "Animation",
                        "description": "Animation: it is an infinitely diverse genre of motion picture art. From cartoons to special effects, from computer games to online interfaces, from art films to commercials, it offers plenty of opportunities to deploy your creativity.<br><br>At MET you can prepare for these challenges in an inspiring environment with excellent instructors and the most modern tools. While learning the fundamentals of the profession, you can lose yourself either in classical methods or the novelties of digital technologies, according to your own makings and interests.<br><br>COME TO US if you are good at drawing and you would like to vivify your creatures, if you would try what it is like to animate on a trick desk and to shoot to a proper film, and if you want to know how to navigate with a “bird” in the 3D design software Leonar3Do. We are waiting for you either if you need help with learning how to use the different computer softwares, or if you have already felt at home in digital design.",
                        "tuitionFee": "2300",
                        "deadline": "30/07/2018",
                        "requirements": "High school / secondary education (or higher)",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 5.5+ or TOEFL 69+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 1
                    },
                    {
                        "courseName": "Business Administration and Management",
                        "description": "Be successful! Success has many components. If you want to succeed in business, you should be ready to think big, capable of comprehending far-reaching processes and have analytical, organizational and managerial skills in order to deliver business results. This is inconceivable without cutting-edge knowledge, and effective management and communications training. Our courses prepare our students to meet any business challenge imaginable, as in addition to receiving a thorough grounding in economics, students will also learn how to make powerful presentations, handle business negotiations, organize events and write press releases.<br><br>The programme is designed for individuals who:<br>are interested in the processes and practice of business life, business organization, marketing and business communication, and who have good analytical, problem-solving and organizational skills. The ideal applicant would like to learn the principles of managing resources and production factors, the principles and methods of establishing organizations and institutions, and of developing and changing their structure and their organizational behaviour.",
                        "tuitionFee": "1700",
                        "deadline": "30/07/2018",
                        "requirements": "High school / secondary education (or higher)",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 5.5+ or TOEFL 69+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "3.5 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 2
                    },
                    {
                        "courseName": "Commerce and Marketing",
                        "description": "Commerce and Marketing is probably the most practice-oriented major among BSc programmes in economics. It provides fundamental business and economic knowledge that offers an unrivaled range of potential directions of career and further training. The areas of marketing, PR, advertising and communication are all open highways for our graduates.<br><br>The programme is designed for individuals who:<br>have strong verbal and written communications skills, who are vigilantly observant and up-to-date on what is happening in the world of business, and who are interested in the concept and operation of commerce and marketing.",
                        "tuitionFee": "1700",
                        "deadline": "30/07/2018",
                        "requirements": "High school / secondary education (or higher)",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 5.5+ or TOEFL 69+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "3.5 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 3
                    },
                    {
                        "courseName": "Communication and Media Science",
                        "description": "Important features of the programme:<br>• teaching creative communication: writing, speaking and problem solving skills; development of critical thinking and negotiating abilities; learning techniques of assertiveness. • social media teaching: understanding the new type of communications and the radical changings of social media publicity and conscious usage of it; features of social networks. • project education: students may learn team work and active creativity • learning to use the media tools. • integrated approach",
                        "tuitionFee": "1700",
                        "deadline": "30/07/2018",
                        "requirements": "High school / secondary education (or higher)",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 5.5+ or TOEFL 69+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "180",
                        "courseID": 4
                    },
                    {
                        "courseName": "Environmental Design",
                        "description": "Culture of environment provides you with an Interior Architecture BA. It is a personalised, practice-oriented, colourful and modern programme.<br><br>We aim to teach professionals who design and decorate the interior and the exterior of our built environment whether independently or as a creative associate. Here you will recognise the coherence of humanity and its environment as well as national and international trends, thus you will be able to work with an ecological approach.<br><br>Emphasis is put on personal contact and consultancy. The speciality of practical primer subjects is interior-, furniture- and architectural design. Thanks to our workshop facilities, you can make your prototypes here. After graduation you can work in architecture or interior design offices, but you can also go on with your studies for an Art MA.<br><br>“Less is more” Mies van der Rohe<br>“Less is a bore” Robert Venturi<br>“More is more” Rem Koolhaas<br>“Yes is more” Bjarke Ingels Group (BIG)<br><br>“Although the education focuses on interior design, thanks to comprehensive design approach, we have the opportunity to study other art branches in the field, like industrial design or landscape architecture. As a result of practical training and a creative cooperation between faculties, we also have the opportunity to get to know a wide range of materials, techniques as well as establish new relationships, thus we can acquire a wider spectrum of knowledge. We can then become professionals who not only understand the relationship between human and built environment but can also analyse and later develop that.”<br>ANNA FEHÉR third-year student<br><br>HEAD OF PROGRAM: Adrienn Emresz DLA Associate Professor, Architect<br><br>PARTNERS: Európa Design Hungary Zrt., Krüllung Kft., Laurum Kft., Falco Zrt.",
                        "tuitionFee": "2300",
                        "deadline": "30/07/2018",
                        "requirements": "High school / secondary education (or higher)<br>A relevant portfolio is required.<br><br>1. A portfolio which contains<br><br>A) free hand drawings (20 pieces max.) representing some visual problem (p. ex. a constellation of objects, a building or a part of a building, a spatial construction);<br>B) photos taken of the works of art created by the applicant.<br><br>2. A narrative curriculum vitae in which the applicant shows us her educational background and highlights the most important events of her life.<br><br>3. A letter of motivation in which the applicant informs us about the reasons of a) choosing to learn environment design and b) deciding to study in Hungary and in our institution.",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 5.5+ or TOEFL 69+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "180",
                        "courseID": 5
                    },
                    {
                        "courseName": "Finance and Accounting",
                        "description": "null",
                        "tuitionFee": "1700",
                        "deadline": "30/07/2018",
                        "requirements": "High school / secondary education (or higher)",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 5.5+ or TOEFL 69+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "3.5 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "210",
                        "courseID": 6
                    },
                    {
                        "courseName": "Graphic Design",
                        "description": "The aim of the program is to design and create visual messages. Students are guided through the work processes, from planning to the finished graphics. This way, they are provided with a comprehensive view on how bring an idea into fruition.<br>During the three-year programme, they become highly proficient in visual culture, and their education enables them to display intellectual and ideological contents in a visual, creative format. Our mission is to raise the standard of visual thinking and encourage students to become committed to innovative, aesthetic and smart graphic design and typography. In addition to handing down professional skills and knowledge, the program also aims at marrying intuition and consciousness in the course of the planning process and to rely on students’ sensitivity and cooperating skills in individual and group work in the studio. The graduates of the program may continue their studies at a master course in graphic design",
                        "tuitionFee": "2300",
                        "deadline": "30/07/2018",
                        "requirements": "High school / secondary education (or higher)",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 5.5+ or TOEFL 69+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "180",
                        "courseID": 7
                    },
                    {
                        "courseName": "International Business Economics",
                        "description": "It is not enough to be an outstanding business expert only back at home. As a member of the European Union, Hungary is in great need of business and communication professionals who are able to understand the challenges and key issues of international economic relations in order to exploit any opportunities that may arise. If you are seeking to do that, you need secure knowledge of economic and business matters, a fluent command of a second language for professional purposes and thorough practical and work experience. The International Business Economics programme of BKF offers exactly that. Our graduate students, with professional level ability in at least two foreign languages, leave school as well-trained business experts with the potential to achieve success and immediate results in the international business scene.<br><br>The programme is designed for individuals who:<br>are well informed with a keen interest in the world of international business, politics and nemzetkozi_gazdalkodas.jpgthe media, who look to find their future career in an international environment and who are open to exposure to foreign cultures. Future students should also be able to use two foreign languages for most personal needs with a desire to improve their existing language skills so that they become an important asset both in their future career and for their companies.",
                        "tuitionFee": "1700",
                        "deadline": "30/07/2018",
                        "requirements": "High school / secondary education (or higher)",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 5.5+ or TOEFL 69+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "3.5 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "210",
                        "courseID": 8
                    },
                    {
                        "courseName": "International Relations",
                        "description": "This program is designed for individuals who<br><br>• would like to have a global impact<br>• would like to harness global forces and opportunities in pursuit of their goals<br>• who are interested in the world of diplomacy, international organizations and transnational corporations<br>• who want to be able to use foreign languages professionally<br>• who want a sound understanding of economics, business management and the way organisations work, but are not interested in the complex mathematics of statistics and econometrics.",
                        "tuitionFee": "1700",
                        "deadline": "30/07/2018",
                        "requirements": "High school / secondary education (or higher)",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 5.5+ or TOEFL 69+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "180",
                        "courseID": 9
                    },
                    {
                        "courseName": "Media Design",
                        "description": "Media designers are the renaissance men of the 21st century. In the age of constant technological revolution their role is not only to follow, but to shape that with artistic sensibility: to make the new digital world modest for us, from the world wide web, through the post-production of films to game development.<br><br>The Media design programme refers to the teaching of such professionals who are able to recognize the technological challenges of our time.",
                        "tuitionFee": "2300",
                        "deadline": "30/07/2018",
                        "requirements": "High school / secondary education (or higher)",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 5.5+ or TOEFL 69+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "180",
                        "courseID": 10
                    },
                    {
                        "courseName": "Photography",
                        "description": "During the course of the programme, students learn the visual design language of photography and how to use its analog and digital technical tools. It is our goal and responsibility to provide photographers graduating from us with credible professional knowledge, giving them the opportunity for continuous development and to stand their ground in any of the fields of photography.<br><br>To make students feel free to apply the possibilities of photography to formulate their ideas, they need to be aware of and possess its technique and technological innovations. Photographers graduating from our institution learn to articulate their thoughts through their future works and stand their ground in the field of applied arts. During practical work they will be capable of individual artistic activity. Critical thinking becomes natural for them, and also that they express their own and others’ artistic activities verbally as well in order to join national and international discourses.",
                        "tuitionFee": "2300",
                        "deadline": "30/07/2018",
                        "requirements": "High school / secondary education (or higher)",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 5.5+ or TOEFL 69+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "180",
                        "courseID": 11
                    },
                    {
                        "courseName": "Tourism and Catering",
                        "description": "Budapest is the buzzing capital of Hungary and one of the most popular tourism destinations in Europe. Consequently, tourism and catering is one of the most popular degree programmes in Hungary as well as in Budapest. This is also due to tourism’s colorful, diverse nature and its human-centered view.<br>The Bachelor of Tourism and Catering programme offers thorough grounding in all important subjects and topics in tourism and catering. What makes the programme really unique is the host of specializations available for students including Health and Wellness Tourism Management, MICE Tourism Management and Destination Management drawing heavily on the rich experience that the local tourism industry gained with Hungary having a world renowned reputation due to its rich thermal healing water assets or its number one position in the international dental tourism.",
                        "tuitionFee": "1700",
                        "deadline": "30/07/2018",
                        "requirements": "High school / secondary education (or higher)",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 5.5+ or TOEFL 69+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "3.5 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "210",
                        "courseID": 12
                    },
                    {
                        "courseName": "Visual Representation (specializing in Film and Media)",
                        "description": "Our teaching staff consists of the teachers of the former Visual Imagery Representation department and the Institute of Graphic Design, Media and Motion Picture Art. The range of education at our department has stretched to include the classical methods of expression such as autonomous graphic design and painting, as well as the digital variations of these art forms. Besides these, presenting the various border areas between applied and media arts brings new colours to our educational palette.<br><br>You can acquire comprehensive theoretical and practical knowledge on the areas of traditional imagery and portrayal as well as study the world of electronic imagery, motion picture and media.<br>Our department offers a strong basis for students to find their way in the traditional and digital visual world, including its traditional, motion picture, multimedia and interactive segments applicable in the areas of art and everyday practical use.<br><br>AFTER GRADUATING FROM THIS PROGRAM you will be ready to study and autonomously apply the potentials in visual language, both in the area of still imagery and motion picture.<br><br>SPECIALIZATIONS: Visual Representation Artist or Film and Media Specialist<br>The specialization will run depending on the minimum number of applicants being reached.<br><br>The academic programme is constituted by two, essentially separated specializations: Film and Media Studies which is centred around cinematographic and narrative representation, and Visual Representation which is concerned with the problems of the medium of picture and its ability to interpret and understand the world and human condition.<br><br>“Our teaching staff consists of the teachers of the former Visual Representation department and the Institute of Graphic Design, Media and Motion Picture Art. The range of education at our department has stretched to include the classical methods of expression such as autonomous graphic design and painting, as well as the digital variations of these art forms. Besides these, presenting the various border areas between applied and media arts brings new colours to our educational palette.”<br>GYULA JÚLIUS DLA – Associate Professor, Professional Executive, Munkácsy Mihály Award-winning Visual Artist<br><br>HEAD OF PROGRAM: SÁNDOR RÁCMOLNÁR DLA Associate Professor, Munkácsy Mihály Award-winning Graphic Artist",
                        "tuitionFee": "2300",
                        "deadline": "30/07/2018",
                        "requirements": "High school / secondary education (or higher)",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 5.5+ or TOEFL 69+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "180",
                        "courseID": 13
                    },
                    {
                        "courseName": "Visual Representation (Visual Representation Artist)",
                        "description": "Our teaching staff consists of the teachers of the former Visual Imagery Representation department and the Institute of Graphic Design, Media and Motion Picture Art. The range of education at our department has stretched to include the classical methods of expression such as autonomous graphic design and painting, as well as the digital variations of these art forms. Besides these, presenting the various border areas between applied and media arts brings new colours to our educational palette.<br><br>You can acquire comprehensive theoretical and practical knowledge on the areas of traditional imagery and portrayal as well as study the world of electronic imagery, motion picture and media.<br>Our department offers a strong basis for students to find their way in the traditional and digital visual world, including its traditional, motion picture, multimedia and interactive segments applicable in the areas of art and everyday practical use.<br><br>AFTER GRADUATING FROM THIS PROGRAM you will be ready to study and autonomously apply the potentials in visual language, both in the area of still imagery and motion picture.<br><br>SPECIALIZATIONS: Visual Representation Artist or Film and Media Specialist<br>The specialization will run depending on the minimum number of applicants being reached.<br><br>The academic programme is constituted by two, essentially separated specializations: Film and Media Studies which is centred around cinematographic and narrative representation, and Visual Representation which is concerned with the problems of the medium of picture and its ability to interpret and understand the world and human condition.<br><br>“Our teaching staff consists of the teachers of the former Visual Representation department and the Institute of Graphic Design, Media and Motion Picture Art. The range of education at our department has stretched to include the classical methods of expression such as autonomous graphic design and painting, as well as the digital variations of these art forms. Besides these, presenting the various border areas between applied and media arts brings new colours to our educational palette.”<br>GYULA JÚLIUS DLA – Associate Professor, Professional Executive, Munkácsy Mihály Award-winning Visual Artist<br><br>HEAD OF PROGRAM: SÁNDOR RÁCMOLNÁR DLA Associate Professor, Munkácsy Mihály Award-winning Graphic Artist",
                        "tuitionFee": "2300",
                        "deadline": "30/07/2018",
                        "requirements": "High school / secondary education (or higher)",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 5.5+ or TOEFL 69+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "180",
                        "courseID": 14
                    },
                    {
                        "courseName": "Art and Design Management",
                        "description": "ART AND DESIGN MANAGEMENT MA<br><br>Design in a broader sense – meaning all creative solutions as a whole- is indispensable in today’s global economics.<br>The development & management of product structure and national and international relations of for-profit and non-profit actors of the art sector require professionals who are familiar with contemporary design, art scenes and trends.<br><br>WHAT CAN YOU STUDY?<br>- project management and skills focusing on practice orientation<br>- cooperation techniques<br>- flexible knowledge: knowledge on the contemporary art and design scene combined with entrepreneurial skills",
                        "tuitionFee": "2700",
                        "deadline": "30/07/2018",
                        "requirements": "Bachelor degree<br><br>The entry qualification documents are accepted in the following languages: English / Hungarian.<br><br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.<br><br>You must take the original entry qualification documents along with you when you finally go to the university.",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 6+ or TOEFL 79+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 15
                    },
                    {
                        "courseName": "Business Development",
                        "description": "Complex skills are needed for the development of enterprises and their changing processes. As a student of the major you will be able to master not only the theory and methodological knowledge of innovation but also you will be able to increase your business knowledge in project leadership, analytical and evaluation methods as well as communication and negotiation technique skills. We will help you understand the connections and interactions of business management in order to be able to do business in middle-management and leadership positions in the field of domestic and international business.<br><br>“Would you like me to give you a formula for success? It’s quite simple, really. Double your rate of failure. You’re thinking of failure as the enemy of success. But it isn’t at all… You can be discouraged by failure – or you can learn from it. So go ahead and make mistakes. Make all you can. Because, remember that’s where you’ll find success. On the far side.”<br>Thomas J. Watson<br>1874-1956, Chairman of IBM",
                        "tuitionFee": "2100",
                        "deadline": "30/07/2018",
                        "requirements": "The entry qualification documents are accepted in the following languages: English / Hungarian.<br><br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.<br><br>You must take the original entry qualification documents along with you when you finally go to the university.",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 6+ or TOEFL 79+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 16
                    },
                    {
                        "courseName": "Communication and Media Studies",
                        "description": "The communication master course offers theoretical knowledge with a strong focus on practical, professional skills and competences. In order to achieve that objective<br>the educational programme of the course is strongly media-oriented which is based on a thorough grounding in social and behavioural sciences;<br>complying with current social and labour market demands, the course integrates the fields of communication theory, media studies, social sciences, political science, sociology, psychology and cultural studies within the field of social sciences offering a knowledge of high standard, which can be put to a profitable and practical use in various areas;<br>the course is planned to include one optional modules: International Communication.<br>In accordance with the educational objectives of the programme, the module places special emphasis on developing the cross-cultural and intercultural competences of students who are also introduced to the complex system of international organizations and the intricate processes that shape international relations.<br>Specialization: International Communication Module<br>By launching the International Communication module, we wish to provide for the training of professionals who are able to perform entrepreneurial, networking and managerial tasks in various fields of international social and political relations based on their comprehensive knowledge and skills gained in the area of mass communication and intercultural communication in addition to their excellent command of two foreign languages used for specific professional purposes.",
                        "tuitionFee": "2100",
                        "deadline": "30/07/2018",
                        "requirements": "Undergraduate diploma (or higher)<br><br>(Social Sciences, Humanities, Business, Economics, Law) or a degree obtained in any other academic field;<br><br>The entry qualification documents are accepted in the following languages: English / Hungarian.<br><br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.<br><br>You must take the original entry qualification documents along with you when you finally go to the university.",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 6+ or TOEFL 79+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "120",
                        "courseID": 17
                    },
                    {
                        "courseName": "Graphic Design",
                        "description": "Acquiring this degree enables our students to interpret the tasks at hand in the context of visual communication, and provide creative and innovative solutions, and makes them capable of working on a high artistic level as graphic designers.<br><br>Ideal students for this programme are capable of working individually and managing groups in graphic designing tasks, assessing their own activities critically, creating value and initiating and practicing individual responsibility. This major prepares for further PHD studies by offering adequate background and practical knowledge.",
                        "tuitionFee": "2700",
                        "deadline": "30/07/2018",
                        "requirements": "Undergraduate diploma (or higher)<br><br/The entry qualification documents are accepted in the following languages: English / Hungarian.<br><br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.<br><br>You must take the original entry qualification documents along with you when you finally go to the university.",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 6+ or TOEFL 79+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 18
                    },
                    {
                        "courseName": "Management and Leadership",
                        "description": "Budapest is the buzzing capital of Hungary and one of the most popular tourism destinations in Europe. According to its central geographical location in Europe Budapest hosts<br><br>- banks and financial institutions,<br>- numerous European and regional headquarters, representative offices,<br>- regional and global service centres,<br>- factories and logistics hubs of multinational companies,<br>- as well as seats of local and national companies.<br>Our institution has a strong relationship with a broad scale of these companies and professional organizations, thus the Management and leadership MA programme in BKF is one of the most potential degree programmes in Hungary as well as in Budapest.<br>The programme is designed for individuals who are: open minded, who have good problem-solving and organizational skill, interested in business, personal and organizational communication.",
                        "tuitionFee": "2100",
                        "deadline": "30/07/2018",
                        "requirements": "Undergraduate diploma (or higher)<br><br>The entry qualification documents are accepted in the following languages: English / Hungarian.<br><br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.<br><br>You must take the original entry qualification documents along with you when you finally go to the university.",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 6+ or TOEFL 79+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 19
                    },
                    {
                        "courseName": "Master of Business Administration",
                        "description": "BEAT THE COMPETITION<br>Today people from all walks of life face stiff competition in nearly every aspect of life. As the competition increases, success is judged only by our abilities to persist, prevail, and lead. The only way to get ahead of the competition is to have the appropriate knowledge and skills that makes you a truly competitive job candidate and highly competent employee. Fortunately, you can now acquire this education at Hungary’s largest private higher education institution. Budapest Metropolitan University equips you with everything you need to be successful in the increasingly competitive 21st-century economy.<br><br>You are the right candidate for our MBA programme if, in order to further your career:<br>• you want to acquire the knowledge and skills that can be flexibly applied in any area of business with the most up-to-date methods of knowledge transfer;<br>• you intend to accelerate your career;<br>• you would like to increase your salary;<br>• you are determined to become more successful than others.",
                        "tuitionFee": "2500",
                        "deadline": "30/07/2018",
                        "requirements": "Undergraduate diploma (or higher)<br><br>attach an employer reference certifying that you have at least 2 years’ work experience gained at a company<br>(stamped, signed document is required)<br><br>The entry qualification documents are accepted in the following languages: English / Hungarian.<br><br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.<br><br>You must take the original entry qualification documents along with you when you finally go to the university.",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 6+ or TOEFL 79+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 20
                    },
                    {
                        "courseName": "Pre-Master for Business",
                        "description": "Are you interested in studying a Master’s programme but don’t meet the entry requirements from what you studied at undergraduate level?<br><br>Perhaps you are considering changing your course of study?<br><br>Pre-master’s course is the ideal way to prepare you for your advanced level of study and make you really professional in your future job.<br><br>What is a Pre-Master program at METU?<br><br>Our Pre-Master programmes are designed to prepare international students fully for studying at postgraduate level in the field of Communication or Business.<br><br>A Pre-Masters is for students who need to improve their academic skills required for successful postgraduate study. The course takes one semester and provide essential grounding for successful postgraduate study.<br><br>Why do I need to study a Pre-Masters?<br>• Your undergraduate degree is not related to the field you would like to study.<br>• You do not have the required number of credits – at least 30 credits – to start your studies on MA level in the field of Business or Communication.<br><br>Pre-Masters entry requirements:<br>• Undergraduate degree<br>• Academic transcript of records<br>• English level equivalent to IELTS 6.0",
                        "tuitionFee": "2000",
                        "deadline": "30/07/2018",
                        "requirements": "Undergraduate diploma (or higher)<br><br>The entry qualification documents are accepted in the following languages: English / Hungarian.<br><br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.<br><br>You must take the original entry qualification documents along with you when you finally go to the university.",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 6+ or TOEFL 79+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "null",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 21
                    },
                    {
                        "courseName": "Pre-Master for Communication",
                        "description": "Are you interested in studying a Master’s programme but don’t meet the entry requirements from what you studied at undergraduate level?<br><br>Perhaps you are considering changing your course of study?<br><br>Pre-master’s course is the ideal way to prepare you for your advanced level of study and make you really professional in your future job.<br><br>What is a Pre-Master program at METU?<br><br>Our Pre-Master programmes are designed to prepare international students fully for studying at postgraduate level in the field of Communication or Business.<br>A Pre-Masters is for students who need to improve their academic skills required for successful postgraduate study. The course takes one semester and provide essential grounding for successful postgraduate study.<br><br>Why do I need to study a Pre-Masters?<br>• Your undergraduate degree is not related to the field you would like to study.<br>• You do not have the required number of credits – at least 30 credits – to start your studies on MA level in the field of Business or Communication.<br><br>Pre-Masters entry requirements:<br>• Undergraduate degree<br>• Academic transcript of records<br>• English level equivalent to IELTS 6.0",
                        "tuitionFee": "2000",
                        "deadline": "30/07/2018",
                        "requirements": "Undergraduate diploma (or higher)<br><br>(Social Sciences, Humanities, Law) or a degree obtained in any other academic field;<br><br>The entry qualification documents are accepted in the following languages: English / Hungarian.<br><br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.<br><br>You must take the original entry qualification documents along with you when you finally go to the university.",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 6+ or TOEFL 79+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "null",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 22
                    },
                    {
                        "courseName": "Tourism Management",
                        "description": "Budapest Metropolitan University (METU) is launching a new MSc in Tourism Management (Masters) Programme which combines a global knowledge of tourism, international business and creative specialisms.<br><br>Budapest is one of the most exciting tourism destinations in the world and the number of international tourists as well as students is growing. As well as its beautiful heritage sites and Danube river views, the city is the only capital city in the world which has so many thermal baths or spas, it was nominated as City of Design by UNESCO Creative Cities Network, and the city offers a lively cultural scene and nightlife with its world-famous ’ruin bars’.<br><br>In terms of education, METU has many unique features. The most important is that creativity is one of the core values of the University. This is reflected in the MSc Programme’s curriculum, which includes many creative courses such as Creative Industries, Cultural, Creative and Heritage Tourism, ICT and Creative Media, Creative Experience Design, Creative City Development and Creative Project Work. METU also has strong links with UNITWIN (UNESCO’s University Twinning and Networking Programme) for its heritage-related courses.<br><br>A second unique feature is the emphasis on project-based learning. All of our courses have a very practical as well as an academic focus. Our links to industry partners in Budapest and internationally are strong, and we try wherever possible to involve students in real-life projects, research activities and event organisation and hosting.<br><br>A third exciting feature is that METU is growing very fast in terms of internationalisation. This means that we are ready to welcome students from a wide range of countries and cultural backgrounds, which also makes the student experience a very rich and exciting one!<br><br>The MSc Tourism Management Programme combines a number of courses, which are especially designed to give students a strong foundation in global business and tourism, creative thinking and innovation, as well as Budapest-specific knowledge. For example, one course focuses on global health tourism combined with case studies of the Budapest thermal baths and spas. The Creativity City development course will examine global cities, but also Budapest’s City of Design status and creative quarter developments.",
                        "tuitionFee": "2100",
                        "deadline": "30/07/2018",
                        "requirements": "Undergraduate diploma (or higher)<br><br>The entry qualification documents are accepted in the following languages: English / Hungarian.<br><br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.<br><br>You must take the original entry qualification documents along with you when you finally go to the university.",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 6+ or TOEFL 79+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 23
                    },
                    {
                        "courseName": "",
                        "description": "",
                        "tuitionFee": "2100",
                        "deadline": "30/07/2018",
                        "requirements": "Bachelor degree<br><br>The entry qualification documents are accepted in the following languages: English / Hungarian.<br><br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.<br><br>You must take the original entry qualification documents along with you when you finally go to the university.",
                        "language": "Accepted proof of proficiency: FCE or CAE, IELTS 6+ or TOEFL 79+<br><br>Intermediate command of English is required. Applicants’ command of English may be assessed in the course of a Skype interview.",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 24
                    }
                ]
            },
            {
                id: "3",
                "universityname": "International Business School",
                "aboutUniversity": "Come to study for a British degree at a truly international business school in the heart of Europe!<br><br>We offer 3-year Bachelor's, 1-year Master's degrees and doctoral programmes in Budapest and in Vienna. Learn more about the history, programmes and staff by browsing through these pages!",
                "generalRequirement": "",
                "data-keyword": "",
                "country": "Hungary",
                "student_payment": false,
                "application_url": "https://apply.ibsbudapest.com/",
                "email":"info@ibs-b.hu",
                "campusImgUrl": "",
                "universityProfilePic": "ibs",
                "skypeID": "",
                "examinationPortal": "",
                "universityAddress": "",
                "universityLogo": "images/ibs-university-study-in-budapest-mobile-app.png",
                "visibility": "show",
                "courses": [{
                        "courseName": "BSc in Financial Management",
                        "description": "Everyone would like to know how to make successful business decisions, but only a few know which numbers to look at and which trends to follow to really make one.<br> As a graduate of this financial management programme, you will develop your ability to read and understand financial statements, evaluate business propositions and acquire knowledge about how capital and money markets work.",
                        "tuitionFee": "3300",
                        "deadline": "31/07/2018",
                        "requirements": "High School Leaving Certificate",
                        "language": "BSc applicants are required to pass IBS’ own English Language Placement Test  that consists of a 100 minute test and an oral part with a listening task.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.0 points (including a minimum of 6 for both the reading and writing component)<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 550 (213 in the computerised version, 80 in the iBT version)<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    International GCSE English as a Second Language with a score of C or higher on extended curriculum<br>    London University GCE O level Syllabus B in English Language with a score of C or higher<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the oral part.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 0
                    },
                    {
                        "courseName": "BSc in Management",
                        "description": "Management is sometimes defined as the achievement of results with, and through, others. Whether the challenge is beating the competitors or educating future professionals, the answer often comes down to management.",
                        "tuitionFee": "3300",
                        "deadline": "31/07/2018",
                        "requirements": "High School Leaving Certificate",
                        "language": "BSc applicants are required to pass IBS’ own English Language Placement Test  that consists of a 100 minute test and an oral part with a listening task.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.0 points (including a minimum of 6 for both the reading and writing component)<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 550 (213 in the computerised version, 80 in the iBT version)<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    International GCSE English as a Second Language with a score of C or higher on extended curriculum<br>    London University GCE O level Syllabus B in English Language with a score of C or higher<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the oral part.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 1
                    },
                    {
                        "courseName": "BSc in Management with Arts",
                        "description": "This is a specialisation of the Management programme.<br><br>This programme trains you to be successful in managing the people and the organisations that make up the arts and events communities. You will not only gain insight into the history, funding, ownership and creation of arts, including the music industry, but also get hands-on experience with the artistic creative process through practicum modules. By taking optional modules, you can immerse in special areas of interest, such as pop music, film industry or gallery management.",
                        "tuitionFee": "3300",
                        "deadline": "31/07/2018",
                        "requirements": "High school diploma and a certified English translation of your high school diploma if it is not in English.",
                        "language": "BSc applicants are required to pass IBS’ own English Language Placement Test  that consists of a 100 minute test and an oral part with a listening task.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.0 points (including a minimum of 6 for both the reading and writing component)<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 550 (213 in the computerised version, 80 in the iBT version)<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    International GCSE English as a Second Language with a score of C or higher on extended curriculum<br>    London University GCE O level Syllabus B in English Language with a score of C or higher<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the oral part.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 2
                    },
                    {
                        "courseName": "BSc in Management with Tourism",
                        "description": "This is a specialisation of the Management programme.<br><br>Tourism is a sector that is at the heart of many of the big moments in modern life such as major music or sports events, family weekends or a dream holiday on an island. We will ensure that you have the necessary skills to manage operations and businesses across a diverse range of contexts including tourism, cultural heritage, festivals and events.",
                        "tuitionFee": "3300",
                        "deadline": "31/07/2018",
                        "requirements": "High school diploma and a certified English translation of your high school diploma if it is not in English.",
                        "language": "BSc applicants are required to pass IBS’ own English Language Placement Test  that consists of a 100 minute test and an oral part with a listening task.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.0 points (including a minimum of 6 for both the reading and writing component)<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 550 (213 in the computerised version, 80 in the iBT version)<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    International GCSE English as a Second Language with a score of C or higher on extended curriculum<br>    London University GCE O level Syllabus B in English Language with a score of C or higher<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the oral part.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 3
                    },
                    {
                        "courseName": "BSc in Management with Psychology",
                        "description": "This is a specialisation of the Management programme.<br><br>This programme delivers an interdisciplinary understanding of generic business issues, providing you with a contextual understanding of the latest knowledge of psychology.",
                        "tuitionFee": "3300",
                        "deadline": "31/07/2018",
                        "requirements": "High school diploma and a certified English translation of your high school diploma if it is not in English.",
                        "language": "BSc applicants are required to pass IBS’ own English Language Placement Test  that consists of a 100 minute test and an oral part with a listening task.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.0 points (including a minimum of 6 for both the reading and writing component)<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 550 (213 in the computerised version, 80 in the iBT version)<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    International GCSE English as a Second Language with a score of C or higher on extended curriculum<br>    London University GCE O level Syllabus B in English Language with a score of C or higher<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the oral part.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 4
                    },
                    {
                        "courseName": "BSc in Management with Marketing",
                        "description": "This is a specialisation of the Management programme.",
                        "tuitionFee": "3300",
                        "deadline": "31/07/2018",
                        "requirements": "High school diploma and a certified English translation of your high school diploma if it is not in English.",
                        "language": "BSc applicants are required to pass IBS’ own English Language Placement Test  that consists of a 100 minute test and an oral part with a listening task.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.0 points (including a minimum of 6 for both the reading and writing component)<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 550 (213 in the computerised version, 80 in the iBT version)<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    International GCSE English as a Second Language with a score of C or higher on extended curriculum<br>    London University GCE O level Syllabus B in English Language with a score of C or higher<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the oral part.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 5
                    },
                    {
                        "courseName": "BSc in Business and Diplomacy",
                        "description": "This programme will lead you to a sophisticated, interdisciplinary understanding of international business, providing you with a contextual understanding of contemporary international relations, and equipping you with skills, traditionally required in international diplomacy. You will have in-depth knowledge of a geographical region of your choice.",
                        "tuitionFee": "3300",
                        "deadline": "31/07/2018",
                        "requirements": "High school diploma and a certified English translation of your high school diploma if it is not in English.",
                        "language": "BSc applicants are required to pass IBS’ own English Language Placement Test  that consists of a 100 minute test and an oral part with a listening task.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.0 points (including a minimum of 6 for both the reading and writing component)<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 550 (213 in the computerised version, 80 in the iBT version)<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    International GCSE English as a Second Language with a score of C or higher on extended curriculum<br>    London University GCE O level Syllabus B in English Language with a score of C or higher<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the oral part.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 6
                    },
                    {
                        "courseName": "MSc in Human Resource Management",
                        "description": "MSc in Human Resource Management (ranked no. 4 in Eastern Europe!*), mixing theory and practice successfully, offers an opportunity for in-depth study of organisations and the management of work. Graduates are equipped to pursue a wide variety of career options in the HR arena, including employee relations, employee development, assessment and recruitment.",
                        "tuitionFee": "4700",
                        "deadline": "31/07/2018",
                        "requirements": "First or second class Bachelor's degree in any field of study.",
                        "language": "MSc applicants are required to pass IBS’ own English Language Placement Test that consists of a 100 minute test and an Orientation Interview.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.5 points (including a minimum of 6.5 in each component of assessment)<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 575 (232 in the computerised version, 90 in the iBT version),<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    International GCSE English as a Second Language with a score of C or higher on extended curriculum<br>    London University GCE O level Syllabus B in English Language with a score of C or higher<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the interview.",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 7
                    },
                    {
                        "courseName": "MSc in International Management",
                        "description": "MSc in International Management (ranked no. 8 in Eastern Europe!*) attracts a culturally diverse mix of international students. It is an ideal choice if you want to progress in your career from entry-level to a managerial position. Graduates go on to pursue a variety of successful careers in corporate organisations, or perform managerial roles in smaller and medium-sized organisations throughout the world.",
                        "tuitionFee": "4700",
                        "deadline": "31/07/2018",
                        "requirements": "First or second class Bachelor's degree in any field of study.",
                        "language": "MSc applicants are required to pass IBS’ own English Language Placement Test that consists of a 100 minute test and an Orientation Interview.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.5 points (including a minimum of 6.5 in each component of assessment)<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 575 (232 in the computerised version, 90 in the iBT version),<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    International GCSE English as a Second Language with a score of C or higher on extended curriculum<br>    London University GCE O level Syllabus B in English Language with a score of C or higher<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the interview.",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 8
                    },
                    {
                        "courseName": "MSc in Financial Management",
                        "description": "MSc in Financial Management (TOP 100 - Global ranking ranked N°79 in Financial Markets, Worldwide!*) is suitable for those intending to develop their careers in finance, broadly defined as corporate finance, security analysis, portfolio management, treasury management, the functioning of financial institutions and markets, and financial decision-making in the public or not-for-profit sectors. For those already working in finance, the programme will enhance their effectiveness by covering the latest developments in the field, encouraging them to question traditional techniques and take an analytical approach to problem-solving.",
                        "tuitionFee": "4700",
                        "deadline": "31/07/2018",
                        "requirements": "Relevant first or second class Bachelor's degree.",
                        "language": "MSc applicants are required to pass IBS’ own English Language Placement Test that consists of a 100 minute test and an Orientation Interview.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.5 points (including a minimum of 6.5 in each component of assessment)<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 575 (232 in the computerised version, 90 in the iBT version),<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    International GCSE English as a Second Language with a score of C or higher on extended curriculum<br>    London University GCE O level Syllabus B in English Language with a score of C or higher<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the interview.",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 9
                    },
                    {
                        "courseName": "MSc in Marketing Management",
                        "description": "MSc in Marketing Management programme (ranked no. 5 in Eastern Europe!*)  develops knowledge and skills in business and marketing and directs students towards the commercial environment. The programme also seeks to encourage one's creative expression and help smooth a path to this exciting sector. Our graduates are represented in an extremely diverse range of multinational, national and local organisations the world over, including sales, advertising, account management, PR and market research.",
                        "tuitionFee": "4700",
                        "deadline": "31/07/2018",
                        "requirements": "Relevant first or second class Bachelor's degree.",
                        "language": "MSc applicants are required to pass IBS’ own English Language Placement Test that consists of a 100 minute test and an Orientation Interview.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.5 points (including a minimum of 6.5 in each component of assessment)<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 575 (232 in the computerised version, 90 in the iBT version),<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    International GCSE English as a Second Language with a score of C or higher on extended curriculum<br>    London University GCE O level Syllabus B in English Language with a score of C or higher<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the interview.",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 10
                    },
                    {
                        "courseName": "MBA in Data-Driven Management programme",
                        "description": "The programme explores and develops all areas of corporate management, with a strong emphasis on the most in-demand skills in business: analytical skills, data management, business intelligence and a wide array of soft skills. The IBS MBA experience is a one-year Full time programme, designed for professionals with 3 to 5 years of work experience.<br><br>Our programme first focuses on ‘core skills,’ i.e. the necessary competencies to communicate and collaborate with other stakeholders, to acquire solid organizational, project management and up-to-date financial and analytical skills. The second part of the programme focuses on ‘functional skills,’ i.e. advanced skills for managing roles in corporate organisations, including data management and business intelligence, customer relationship management and strategic decision-making skills. The programme concludes with a capstone project assessing your newly acquired business acumen and business intelligence skills.",
                        "tuitionFee": "6200",
                        "deadline": "31/07/2018",
                        "requirements": "Bachelor's degree in any field, transcript with at least one module in mathematics or finance, CV, work reference of 3-5 years, motivation letter ",
                        "language": "MSc applicants are required to pass IBS’ own English Language Placement Test that consists of a 100 minute test and an Orientation Interview.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.5 points (including a minimum of 6.5 in each component of assessment)<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 575 (232 in the computerised version, 90 in the iBT version),<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    International GCSE English as a Second Language with a score of C or higher on extended curriculum<br>    London University GCE O level Syllabus B in English Language with a score of C or higher<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the interview.",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 11
                    },
                    {
                        "courseName": "MSc in Brand Management by Research",
                        "description": "What are the challenges that marketing and branding face today? What links are there between management, marketing and strong product or service brands? Today’s marketers do not simply need an understanding of consumer needs, they must also be able to communicate to diverse, global audiences and be sensitive to cultural and international differences. At IBS, research students will be encouraged to explore and engage with potential brand strategies and develop an understanding of their social, political and cultural context.<br><br>The Master’s by research programme offered by IBS allows you to pursue your own theories and ideas and contribute to research in your field. The emphasis of our Master’s by research programme is on independent research and one-on-one consultations.<br><br>IBS welcomes research proposals that match or are similar to IBS staff’s current research topics and/or fall within the potential supervisors’ areas of expertise. You can gain more specific knowledge on the supervisors and the topics that they are familiar with, by clicking on their name on the right side of the page. (N.B. The list is not a comprehensive register of all potential supervisors as faculty from other programmes or faculty members without full supervisory privileges may request approval to supervise graduate students in this programme.)",
                        "tuitionFee": "4700",
                        "deadline": "15/04/2018",
                        "requirements": "first or second class, upper division degree or significant work experience. A Master’s degree is preferred. Please email your detailed research plan and one academic referee’s report soon after your online application to info@ibs-b.hu<br><br>    sufficient English skills and academic knowledge that the IBS Research Officer checks with an Orientation Interview via Skype. The interview is followed by the IBS English language test (you can be exempt from the test with a sufficient score of IELTS, TOEFL, Cambridge or Pearson),<br><br>    If student is accepted by the Research Programmes Council, student will proceed with payment transfer of the first year’s fee and start the visa application if required.",
                        "language": "MSc applicants are required to pass IBS’ own English Language Placement Test that consists of a 100 minute test and an Orientation Interview.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.5 points (including a minimum of 6.5 in each component of assessment)<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 575 (232 in the computerised version, 90 in the iBT version),<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    International GCSE English as a Second Language with a score of C or higher on extended curriculum<br>    London University GCE O level Syllabus B in English Language with a score of C or higher<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the interview.",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 12
                    },
                    {
                        "courseName": "MSc in Development Economics by Research",
                        "description": "Do you want to know how economic and policy instruments can spur growth of a country, how to assess the impact of a policy measure, or how to efficiently help developing countries reach adequate living standards? If you would like to do your own research in this field one day or work with governments and aid agencies advising them on current development issues, our MSc by Research in Development Economics might be just the right study for you.<br><br>The Master’s by research programme offered by IBS allows you to pursue your own theories and ideas and contribute to research in your field. The emphasis of our Master’s by research programme is on independent research and one-on-one consultations.<br><br>IBS welcomes research proposals that match or are similar to IBS staff’s current research topics and/or fall within the potential supervisors’ areas of expertise. For a list of IBS faculty members with full supervisory privileges who are affiliated with this programme, please refer to the list below. (N.B. The list is not a comprehensive register of all potential supervisors as faculty from other programmes or faculty members without full supervisory privileges may request approval to supervise graduate students in this programme.)",
                        "tuitionFee": "4700",
                        "deadline": "15/04/2018",
                        "requirements": "first or second class, upper division degree or significant work experience. A Master’s degree is preferred. Please email your detailed research plan and one academic referee’s report soon after your online application to info@ibs-b.hu<br><br>    sufficient English skills and academic knowledge that the IBS Research Officer checks with an Orientation Interview via Skype. The interview is followed by the IBS English language test (you can be exempt from the test with a sufficient score of IELTS, TOEFL, Cambridge or Pearson),<br><br>    If student is accepted by the Research Programmes Council, student will proceed with payment transfer of the first year’s fee and start the visa application if required.",
                        "language": "MSc applicants are required to pass IBS’ own English Language Placement Test that consists of a 100 minute test and an Orientation Interview.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.5 points (including a minimum of 6.5 in each component of assessment)<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 575 (232 in the computerised version, 90 in the iBT version),<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    International GCSE English as a Second Language with a score of C or higher on extended curriculum<br>    London University GCE O level Syllabus B in English Language with a score of C or higher<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the interview.",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 13
                    },
                    {
                        "courseName": "MSc in Financial Consulting by Research",
                        "description": "Our programme offers you the opportunity to carry out research in financial topics and also obtain specific insight into consulting. If you are considering further academic study and you would like the opportunity to research a topic related to financial consulting, the 40,000-word dissertation enables you to test and apply the techniques and theories you have gained.<br><br>The Master’s by research programme offered by IBS allows you to pursue your own theories and ideas and contribute to research in your field. The emphasis of our Master’s by research programme is on independent research and one-on-one consultations.<br><br>IBS welcomes research proposals that match or are similar to IBS staff’s current research topics and/or fall within the potential supervisors’ areas of expertise. For a list of IBS faculty members with full supervisory privileges who are affiliated with this programme, please refer to the list below. (N.B. The list is not a comprehensive register of all potential supervisors as faculty from other programmes or faculty members without full supervisory privileges may request approval to supervise graduate students in this programme.)",
                        "tuitionFee": "4700",
                        "deadline": "15/04/2018",
                        "requirements": "A first or second-class honours degree from a recognised university or a recognised professional qualification with significant and relevant work experience,<br><br>    sufficient English skills and academic knowledge that the IBS Research Officer checks with an Orientation Interview via Skype after the online application. The interview is followed by the IBS English language test (you can be exempt from the test with a sufficient score of IELTS, TOEFL, Cambridge or Pearson),<br><br>    after a successful Skype interview and English testing student must submit his/her proposal by email. If the proposal is accepted, student will proceed with the payment transfer of the first instalment and then will have a consultation session on his/her proposal with the Supervisor via Skype.",
                        "language": "MSc applicants are required to pass IBS’ own English Language Placement Test that consists of a 100 minute test and an Orientation Interview.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.5 points (including a minimum of 6.5 in each component of assessment)<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 575 (232 in the computerised version, 90 in the iBT version),<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    International GCSE English as a Second Language with a score of C or higher on extended curriculum<br>    London University GCE O level Syllabus B in English Language with a score of C or higher<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the interview.",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 14
                    },
                    {
                        "courseName": "MA in Art History by Research",
                        "description": "",
                        "tuitionFee": "4700",
                        "deadline": "15/04/2018",
                        "requirements": "First or second class, upper division degree or significant work experience. A Master’s degree is preferred. Please email your detailed research plan and one academic referee’s report soon after your online application to info@ibs-b.hu<br><br>sufficient English skills and academic knowledge that the IBS Research Officer checks with an Orientation Interview via Skype. The interview is followed by the IBS English language test (you can be exempt from the test with a sufficient score of IELTS, TOEFL, Cambridge or Pearson),<br><br>If student is accepted by the Research Programmes Council, student will proceed with payment transfer of the first year’s fee and start the visa application if required.",
                        "language": "MSc applicants are required to pass IBS’ own English Language Placement Test that consists of a 100 minute test and an Orientation Interview.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.5 points (including a minimum of 6.5 in each component of assessment)<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 575 (232 in the computerised version, 90 in the iBT version),<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    International GCSE English as a Second Language with a score of C or higher on extended curriculum<br>    London University GCE O level Syllabus B in English Language with a score of C or higher<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the interview.",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 15
                    },
                    {
                        "courseName": "MA in International Affairs and Diplomacy by Research",
                        "description": "In an increasingly interconnected, globalized, and complex world, where the importance of multilateral dialogue and cooperation is ever growing, the demand for experts in the field of international relations and diplomacy is constantly rising. Research students will be encouraged to explore and engage with theories, issues, and processes connected with diplomacy, foreign policy, and international relations. The programme is especially relevant for applicants thinking about, or currently working in, diplomacy, international NGOs, and international policy and politics.<br><br>The Master’s by research programme offered by IBS allows you to pursue your own theories and ideas and contribute to research in your field. The emphasis of our Master’s by research programme is on independent research and one-on-one consultations.<br><br>IBS welcomes research proposals that match or are similar to IBS staff’s current research topics and/or fall within the potential supervisors’ areas of expertise. For a list of IBS faculty members with full supervisory privileges who are affiliated with this programme, please refer to the list below. (N.B. The list is not a comprehensive register of all potential supervisors as faculty from other programmes or faculty members without full supervisory privileges may request approval to supervise graduate students in this programme.)",
                        "tuitionFee": "4700",
                        "deadline": "15/04/2018",
                        "requirements": "first or second class, upper division degree or significant work experience. A Master’s degree is preferred. Please email your detailed research plan and one academic referee’s report soon after your online application to info@ibs-b.hu<br><br>    sufficient English skills and academic knowledge that the IBS Research Officer checks with an Orientation Interview via Skype. The interview is followed by the IBS English language test (you can be exempt from the test with a sufficient score of IELTS, TOEFL, Cambridge or Pearson),<br><br>    If student is accepted by the Research Programmes Council, student will proceed with payment transfer of the first year’s fee and start the visa application if required.",
                        "language": "MSc applicants are required to pass IBS’ own English Language Placement Test that consists of a 100 minute test and an Orientation Interview.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.5 points (including a minimum of 6.5 in each component of assessment)<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 575 (232 in the computerised version, 90 in the iBT version),<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    International GCSE English as a Second Language with a score of C or higher on extended curriculum<br>    London University GCE O level Syllabus B in English Language with a score of C or higher<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the interview.",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 16
                    },
                    {
                        "courseName": "DPhil (PHD) in Art History",
                        "description": "Phase 1: MPhil<br><br>Postgraduate students wishing to register for our DPhil programme must first register for the MPhil and seek conversion at a later stage. IBS operates a system of preliminary registration for all research degrees so as to allow students to prepare a formal proposal during their first two semesters of study. All research students must also subject their work to an annual progress review.  <br><br>All students enrolled for the MPhil in Art History programme will be supported by supervisors who will help them develop a programme of research and writing. IBS welcomes research proposals that match or are similar to IBS staff’s current research topics and/or fall within the potential supervisors’ areas of expertise. <br><br>Phase 2: DPhil<br><br>The DPhil in History of Art is an advanced research degree, which those MPhil students may join who made satisfactory progress at the MPhil level by (a) successfully passing a comprehensive review and (b) submitting a feasible research proposal. DPhil students will be encouraged to explore and engage with the current discourse within the discipline of art history and supplement their understanding of art and its cultural context. The academic focus at IBS is on research within a chronological span from ca. 1500 to the present in relation to the art of the western tradition and its global encounters.<br><br>DPhil students undertake supervised but independent research, at the end of which they submit a thesis of not more than 100,000 words embodying the results of that research. This thesis must demonstrate familiarity with, and an understanding of the subject, its principal sources and authorities. It should display critical discrimination and a sense of proportion in evaluating evidence and the judgements of others.  A DPhil thesis must embody an original contribution to the knowledge of business and management either by the discovery of new knowledge, or by the exercise of a new and independent critical approach.<br><br>Recommended PHD topics for art history:<br><br>We encourage and welcome proposals that are working in interdisciplinary fields and connect art, business, art institutions, institutional critique, public relations, marketing, branding in the contemporary world of global economy, and a globalized art world. Traditional art historical approaches should be critically addressed, and extended towards approaches worked out in visual culture. (Representation, realism, myths, media, global flow of information, gender, cultural politics, cultural heritage, heritage and tourism, etc.)<br><br>Below is a list of PHD topics that our academic staff have suggested as research opportunities for PHD in Art History students to undertake. IBS encourages PHD candidates to develop a proposal around one of these topics.<br><br>    New visual trends in advertising /marketing (moving images, photos, changing media, ads in social media)<br>    Art investment. From patronage to art investment and state subsidy / Connoisseurship and art, research for investment in art<br>    Art administration (theory and local case studies, examples, changing role of curators, curators as fund raisers, cultural institutions)<br>    Technology and art / Design thinking and the role of artistic thinking",
                        "tuitionFee": "3100",
                        "deadline": "30/04/2018",
                        "requirements": "first or second class, upper division Master's degree. Please email your detailed research plan and one academic referee’s report soon after your online application to info@ibs-b.hu,<br><br>    sufficient English skills and academic knowledge that the IBS Research Officer checks with an Orientation Interview via Skype. The interview is followed by the IBS English language test (you can be exempt from the test with a sufficient score of IELTS, TOEFL, Cambridge or Pearson),<br><br>    If student is accepted by the Research Programmes Council, student will proceed with payment transfer of the first year’s fee and start the visa application if required.",
                        "language": "The IBS Research Officer checks the applicant's English skills with an Orientation Interview via Skype after the online application. The interview is followed by IBS’own English Language Placement Test that consists of a 100 minute test.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.5 points (including a minimum of 6.5 in each component of assessment),<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 575 (232 in the computerised version, 90 in the iBT version),<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the interview.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "PHD",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 17
                    },
                    {
                        "courseName": "DPhil (PHD) in Business and Management",
                        "description": "Phase 1: MPhil<br><br>Postgraduate students wishing to register for our DPhil programme must first register for the MPhil and seek conversion at a later stage. IBS operates a system of preliminary registration for all research degrees so as to allow students to prepare a formal proposal during their first two semesters of study. All research students must also subject their work to an annual progress review.  <br><br>All students enrolled for the MPhil in Business and Management programme will be supported by supervisors who will help them develop a programme of research and writing. IBS welcomes research proposals that match or are similar to IBS staff’s current research topics and/or fall within the potential supervisors’ areas of expertise. <br><br>Phase 2: DPhil<br><br>The DPhil in Business and Management is an advanced research degree, which those MPhil students may join who made satisfactory progress at the MPhil level by (a) successfully passing a comprehensive review and (b) submitting a feasible research proposal. Companies and institutions need professionals with the skills to manage and market knowledge-intensive products, as well as professionals with a deep understanding of the scientific principles underlying products and processes. IBS’s internationally acknowledged DPhil programme in Business and Management focuses on developing employable expertise through in-depth research. The emphasis is on independent research and one-on-one consultations. <br><br>DPhil students undertake supervised but independent research, at the end of which they submit a thesis of not more than 100,000 words embodying the results of that research. This thesis must demonstrate familiarity with, and an understanding of the subject, its principal sources and authorities. It should display critical discrimination and a sense of proportion in evaluating evidence and the judgements of others.  A DPhil thesis must embody an original contribution to the knowledge of business and management either by the discovery of new knowledge, or by the exercise of a new and independent critical approach.<br><br>Recommended PHD topics for business and management:<br><br>Below is a list of PHD topics that our academic staff have suggested as research opportunities for PHD in Business and Management students to undertake. IBS encourages PHD candidates to develop a proposal around one of these topics.<br><br>Marketing<br><br>    How the Internet of Things (IoT) is to change marketing communication?<br>    Marketing in times of degrowth – a new potential challenge<br>    Importance, effects etc. of packaging in marketing<br><br>HR / CSR<br><br>    Workplace equality and diversity management; workplace diversity and inclusion strategies for specific groups of the labour market<br>    Corporate social responsibility and sustainability, particularly in relation to technology (bio- and medical technology, AI, automation, social media), the financial industry and / or resource-extractive industries<br>    HRM and organisational performance<br><br>Auditing / controlling<br><br>    External and internal auditing: auditors' responsibilities, regulatory frameworks, development of audit procedures in response to current challenges<br>    Controlling: current trends and methods in controlling, its importance in decision-making<br><br>Communication<br><br>    Linguistic and communicative strategies in international negotiations<br>    Analysing aims and intentions in business communication through speech act theory",
                        "tuitionFee": "3100",
                        "deadline": "30/04/2018",
                        "requirements": "first or second class, upper division Master's degree. Please email your detailed research plan and one academic referee’s report soon after your online application to info@ibs-b.hu,<br><br>    sufficient English skills and academic knowledge that the IBS Research Officer checks with an Orientation Interview via Skype. The interview is followed by the IBS English language test (you can be exempt from the test with a sufficient score of IELTS, TOEFL, Cambridge or Pearson),<br><br>    If student is accepted by the Research Programmes Council, student will proceed with payment transfer of the first year’s fee and start the visa application if required.",
                        "language": "The IBS Research Officer checks the applicant's English skills with an Orientation Interview via Skype after the online application. The interview is followed by IBS’own English Language Placement Test that consists of a 100 minute test.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.5 points (including a minimum of 6.5 in each component of assessment),<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 575 (232 in the computerised version, 90 in the iBT version),<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the interview.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "PHD",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 18
                    },
                    {
                        "courseName": "DPhil (PHD) in Economics",
                        "description": "Phase 1: MPhil<br><br>Postgraduate students wishing to register for our DPhil programme must first register for the MPhil and seek conversion at a later stage. IBS operates a system of preliminary registration for all research degrees so as to allow students to prepare a formal proposal during their first two semesters of study. All research students must also subject their work to an annual progress review.  <br><br>All students enrolled for the MPhil in Economics programme will be supported by supervisors who will help them develop a programme of research and writing. IBS welcomes research proposals that match or are similar to IBS staff’s current research topics and/or fall within the potential supervisors’ areas of expertise. <br><br>Phase 2: DPhil<br><br>The DPhil in Economics is an advanced research degree, which those MPhil students may join who made satisfactory progress at the MPhil level by (a) successfully passing a comprehensive review and (b) submitting a feasible research proposal. The academic focus at IBS is on rigorous academic research to enrich the understanding of the regional, national, and international economies and to contribute to the set of analytic tools and perspectives that facilitate policymaking in this area.<br><br>DPhil students undertake supervised but independent research, at the end of which they submit a thesis of not more than 100,000 words embodying the results of that research. This thesis must demonstrate familiarity with, and an understanding of the subject, its principal sources and authorities. It should display critical discrimination and a sense of proportion in evaluating evidence and the judgements of others.  A DPhil thesis must embody an original contribution to the knowledge of business and management either by the discovery of new knowledge, or by the exercise of a new and independent critical approach.<br><br>Recommended PHD topics for economics:<br><br>Below is a list of PHD topics that our academic staff have suggested as research opportunities for PHD in Economics students to undertake. IBS encourages PHD candidates to develop a proposal around one of these topics.<br><br>Economic policy<br><br>    Role and effects of state ownership at various levels of development<br>    Economic policy-making in vulnerable democracies<br>    Welfare reforms in ageing societies<br>    Corruption, its psychological, organizational, social / cross-cultural, and / or developmental aspects<br><br>Behavioural economics<br><br>    The role of emotions in economic decision-making<br>    The effects of trust on cooperation and competition<br><br>Banking<br><br>    Post-2008 business models in banking<br>    Globalization in banking<br>    Fintech versus traditional banking models<br><br>Finance<br><br>    Blockchain and cryptocurrencies: effects on market allocation mechanisms, macro policy, politics etc.<br>    Revolution in global payments industry and financial inclusion<br><br>Networks / big data<br><br>    Big data as 'game changer'? Ethical and social problems of the data-driven world<br>    Data as a new form of power, analyzing and interpreting new types of assymmetries<br>    Social networks and performance<br>    Network-type factors behind economic competitiveness. (And network-analysis in general)",
                        "tuitionFee": "3100",
                        "deadline": "30/04/2018",
                        "requirements": "first or second class, upper division Master's degree. Please email your detailed research plan and one academic referee’s report soon after your online application to info@ibs-b.hu,<br><br>    sufficient English skills and academic knowledge that the IBS Research Officer checks with an Orientation Interview via Skype. The interview is followed by the IBS English language test (you can be exempt from the test with a sufficient score of IELTS, TOEFL, Cambridge or Pearson),<br><br>    If student is accepted by the Research Programmes Council, student will proceed with payment transfer of the first year’s fee and start the visa application if required.",
                        "language": "The IBS Research Officer checks the applicant's English skills with an Orientation Interview via Skype after the online application. The interview is followed by IBS’own English Language Placement Test that consists of a 100 minute test.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.5 points (including a minimum of 6.5 in each component of assessment),<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 575 (232 in the computerised version, 90 in the iBT version),<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the interview.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "PHD",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 19
                    },
                    {
                        "courseName": "DPhil (PHD) in International Affairs",
                        "description": "Phase 1: MPhil<br><br>Postgraduate students wishing to register for our DPhil programme must first register for the MPhil and seek conversion at a later stage. IBS operates a system of preliminary registration for all research degrees so as to allow students to prepare a formal proposal during their first two semesters of study. All research students must also subject their work to an annual progress review.  <br><br>All students enrolled for the MPhil in International Affairs programme will be supported by supervisors who will help them develop a programme of research and writing. IBS welcomes research proposals that match or are similar to IBS staff’s current research topics and/or fall within the potential supervisors’ areas of expertise. <br><br>Phase 2: DPhil<br><br>The DPhil in International Affairs is an advanced research degree, which MPhil students who have completed their first annual review to the required standard may join. The programme is aimed at policy-makers and experts for international affairs to address critical issues centred on diplomacy, foreign policy, and international relations. The emphasis of our doctoral programmes is on independent research and one-on-one consultations.  <br><br>DPhil students undertake supervised but independent research, at the end of which they submit a thesis of not more than 100,000 words embodying the results of that research. This thesis must demonstrate familiarity with, and an understanding of the subject, its principal sources and authorities. It should display critical discrimination and a sense of proportion in evaluating evidence and the judgements of others.  A DPhil thesis must embody an original contribution to the knowledge of business and management either by the discovery of new knowledge, or by the exercise of a new and independent critical approach.<br><br>Recommended PHD Topics for International affairs:<br><br>Below is a list of PHD topics that our academic staff have suggested as research opportunities for PHD in International affairs students to undertake. IBS encourages PHD candidates to develop a proposal around one of these topics.<br><br>    International migration, patterns and effects<br>    Challenges of cohabitation between majority societies and Muslim minorities in Europe<br>    Impact of migrants’ remittances on the sending (home) countries' economy and society - at national, regional, family and / or household level<br>    International aid: traditional versus emerging donors<br>    The European Union's enlargement to the Western Balkans: challenges and perspectives<br>    Disintegration in Europe: Brexit and its aftermath<br>    Economic and social cohesion in the EU: a critical evaluation of the EU's regional policy",
                        "tuitionFee": "3100",
                        "deadline": "30/04/2018",
                        "requirements": "first or second class, upper division Master's degree. Please email your detailed research plan and one academic referee’s report soon after your online application to info@ibs-b.hu,<br><br>    sufficient English skills and academic knowledge that the IBS Research Officer checks with an Orientation Interview via Skype. The interview is followed by the IBS English language test (you can be exempt from the test with a sufficient score of IELTS, TOEFL, Cambridge or Pearson),<br><br>    If student is accepted by the Research Programmes Council, student will proceed with payment transfer of the first year’s fee and start the visa application if required.",
                        "language": "The IBS Research Officer checks the applicant's English skills with an Orientation Interview via Skype after the online application. The interview is followed by IBS’own English Language Placement Test that consists of a 100 minute test.<br><br>If the applicant has a certificate of<br><br>    the International English Language Testing System (IELTS) with a minimum overall score of 6.5 points (including a minimum of 6.5 in each component of assessment),<br>    or the Test of English as a Foreign Language (TOEFL) with a score of 575 (232 in the computerised version, 90 in the iBT version),<br>    Cambridge Certificate of Proficiency in English (CPE) with a score of 176-184 (with a minimum of 175 in each component)<br>    Pearson Test of English Academic (PTE Academic) with a score of 59-65 (with 4 minimum component scores of 59),<br><br>the applicant is not required to take the written test, only the interview.",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "PHD",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 20
                    }
                ]
            },
            {
                id: "4",
                "universityname": "Central European University",
                "aboutUniversity": "CEU delivers a wide range of degree programs at the Master's and Doctoral levels. Click on a link below to learn more about the program or the unit(s) delivering it. Learn more about Master's programs, Doctoral programs, and Erasmus Mundus programs at CEU. You can also filter the programs by their level or Department or School at which they are delivered. Find descriptions here of courses offered at CEU in different departments. To see the full list of courses for the current and upcoming academic year, please visit the department websites.",
                "generalRequirement": "Applicants must have a first degree from a recognized university or institution of higher education, or provide documentation indicating that they will earn such a first degree before enrolment in a CEU master's program.<br><br>For its one-year U.S.-accredited master's programs, CEU normally accepts students who have completed four years of undergraduate university study. Applicants with a three-year bachelor's degree will be considered for two-year master's programs (both for those accredited in the U.S. and in Hungary).<br><br>Admission into the U.S.-accredited one-year programs with a three-year bachelor's degree may be possible pending the University Provost's approval in particular cases, based on the recommendation of the academic unit in question.<br><br>Students enrolled in a master's program at CEU must not be simultaneously enrolled in another higher education institution, unless they provide official documentation about having obtained a leave of absence from the other institution for the entire duration of their studies at CEU. Admitted students are required, if applicable, to indicate enrolment at another institution in the matriculation form at the beginning of their studies at CEU. Individual units may establish additional criteria for admission, such as specific academic backgrounds or minimum language test scores higher than the general CEU minimum requirements.",
                "data-keyword": "",
                "country": "Hungary",
                "student_payment": false,
                "application_url": "https://ceu-grad.embark.com/auth/register",
                "email":"communications_office@ceu.edu",
                "campusImgUrl": "",
                "universityProfilePic": "ceu",
                "skypeID": "",
                "examinationPortal": "",
                "universityAddress": "",
                "universityLogo": "images/ceu-logo.png",
                "visibility": "show",
                "courses": [{
                        "courseName": "Master of Arts in Comparative History (1 year)",
                        "description": "In accordance with the CEU academic calendar the History Department offerings are divided into a Pre-Session (2 weeks: September), the Fall term (12 weeks: late September to December), the Winter term (12 weeks: January-March) and a Spring Session (10 weeks: April-June). The Pre-Session (general orientation about the university and about the curriculum) is designed to introduce students to resources both within CEU and in Budapest. The Fall and Winter terms consist of intensive coursework and lay the groundwork for the Master's thesis. For the one-year MA the Spring Session is largely research-oriented. During April students do fieldwork or archival research. The university provides modest grants to assist students in accomplishing their research (in early February, information is made available about the application procedure for these grants). In May all students return to CEU to consult with their thesis supervisors, participate in workshops with faculty and fellow students to present their projects, and complete their theses by the second week of June.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "The one-year MA program is a very intensive one, designed for applicants with four or five years of previous university education. Having an undergraduate degree in history is an advantage, but the department also welcomes applications from students in other social science and humanities disciplines and will decide on a case by case basis whether the latter can be accepted in the one-year program, or would be better advised to pursue the two-year program. Holders of three-year BA degrees should apply for the two-year program.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "credits": "80",
                        "courseID": 0
                    },
                    {
                        "courseName": "Master of Arts in Comparative History (2 years) - Track: Comparative History from 1500 till present time",
                        "description": "As of 2008, a two-year MA degree in Comparative History was introduced at CEU as a joint initiative of the Department of Medieval Studies and the History Department. It consists of two tracks: Late Antique, Medieval, and Renaissance Studies and the Comparative History from 1500 till present time. In November 2007, this new program was registered by the Board of Regents of the University of the State of New York (US) for and on behalf of the New York State Education Department, and in July 2008 by the Hungarian Accreditation Committee.<br><br>By joining forces, the departments of Medieval Studies and History are able to offer a multifaceted degree program, strongly underpinned by a systematic introduction to theories, methods and research skills in history and related disciplines, focusing on Central, Eastern, Southeastern, and Western Europe and the Eastern Mediterranean from late antiquity to contemporary times, aimed at the understanding of persistent themes in the experience of these regions in a longue durée (historical) perspective. The two-year option does not affect the integrity of the accredited one-year MA programs currently offered by both departments separately, and it extensively relies on their curricula.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "The two-year MA program is as demanding as its one-year alternative, but its pace and substance are designed to meet the interests of students who may need more work on the basics of historical scholarship. It is specifically intended for applicants with a three-year BA (“Bologna type”) degree in history, archaeology, literary history, Classical languages, art history or other related disciplines or students who may have completed four or even five years of undergraduate education, but in a social science or humanities discipline other than history. Holders of four- or five-year undergraduate degrees in history are advised to apply to the one-year program (although they may be directed to the two-year program upon the examination of their individual backgrounds).",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 1
                    },
                    {
                        "courseName": "Master of Arts in Comparative History (2 years) - Track: Late Antique, Medieval, and Renaissance Studies",
                        "description": "As of 2008, a two-year MA degree in Comparative History was introduced at CEU as a joint initiative of the Department of Medieval Studies and the History Department. It consists of two tracks: Late Antique, Medieval, and Renaissance Studies and the Comparative History from 1500 till present time. In November 2007, this new program was registered by the Board of Regents of the University of the State of New York (US) for and on behalf of the New York State Education Department, and in July 2008 by the Hungarian Accreditation Committee.<br><br>By joining forces, the departments of Medieval Studies and History are able to offer a multifaceted degree program, strongly underpinned by a systematic introduction to theories, methods and research skills in history and related disciplines, focusing on Central, Eastern, Southeastern, and Western Europe and the Eastern Mediterranean from late antiquity to contemporary times, aimed at the understanding of persistent themes in the experience of these regions in a longue durée (historical) perspective. The two-year option does not affect the integrity of the accredited one-year MA programs currently offered by both departments separately, and it extensively relies on their curricula.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "The two-year MA program is as demanding as its one-year alternative, but its pace and substance are designed to meet the interests of students who may need more work on the basics of historical scholarship. It is specifically intended for applicants with a three-year BA (“Bologna type”) degree in history, archaeology, literary history, Classical languages, art history or other related disciplines or students who may have completed four or even five years of undergraduate education, but in a social science or humanities discipline other than history. Holders of four- or five-year undergraduate degrees in history are advised to apply to the one-year program (although they may be directed to the two-year program upon the examination of their individual backgrounds).",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 2
                    },
                    {
                        "courseName": "Master of Arts in Critical Gender Studies",
                        "description": "The program aims at developing independent and critical thinkers with a broad basic knowledge of gender studies. A comprehensive and interdisciplinary approach to gender is stressed as a key element of social and symbolic order at both local and global levels. In keeping with these goals, the program introduces students to major theoretical and methodological approaches to gender studies from a range of disciplines. Fellowships and tuition waivers are available.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "MA students do not need to have a prior degree in gender or women’s studies, however, successful applicants tend to have had some exposure to gender as a body of scholarly knowledge and discipline in addition to a sensitivity to its social impact. Applicants should have a genuine interest in developing their knowledge and scholarly perspectives beyond the individual disciplines they have studied at the undergraduate (or Master’s) level.<br><br>In addition to meeting the General CEU Admissions Requirements, applicants should submit a 500-word statement of purpose describing:<br>• their interest in the field of gender studies and in the program of the Department of Gender Studies<br>• any relevant experience (academic, professional or personal), and the expected significance of their studies at CEU for their future career goals",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 3
                    },
                    {
                        "courseName": "Master of Arts in Cultural Heritage Studies - Track: Academic Research and Protection of Cultural Heritage",
                        "description": "Cultural heritage, as understood by Central European University's Cultural Heritage Studies Program, is the legacy of physical artifacts (cultural property) and intangible attributes of a group or society inherited from the past. Cultural Heritage is a concept which offers a bridge between the past and the future with the application of particular approaches in the present. Due to its attached values for these groups or societies, cultural heritage is maintained in the present and bestowed for the benefit of future generations. At the same time, the concept of cultural heritage developed as a result of complex historical processes and is constantly evolving.<br>The Cultural Heritage Studies Program combines theoretical and practical education, offering a variety of theoretical and methodological approaches with a strong emphasis on practical knowledge and skills based on fieldwork, and internships with local, regional and global heritage organizations.<br><br>Historical approach, present social relevance (policy and management), and the integration of cultural and natural heritage issues are the three pillars of the program.<br><br>The program offers a global viewpoint within local Central European heritage contexts (capital of culture, World Heritage sites, urban environmental imperatives, local issues of conflicting interests)<br><br>One of the principles CEU is based on is respect for the diversity of cultures and peoples. As the University attracts students and faculty from 100 countries from around the world, it is an ideal host of a cultural heritage program dealing with disparate traditions, practices and social interactions.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "In addition to the general CEU admission requirements applicants to the two-year MA program in Cultural Heritage Studies: Academic Research, Policy, Management are required to submit (in English) a 1500-word project proposal.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "124",
                        "courseID": 4
                    },
                    {
                        "courseName": "Master of Arts in Cultural Heritage Studies - Track: Cultural Heritage Management and Policy",
                        "description": "Cultural heritage, as understood by Central European University's Cultural Heritage Studies Program, is the legacy of physical artifacts (cultural property) and intangible attributes of a group or society inherited from the past. Cultural Heritage is a concept which offers a bridge between the past and the future with the application of particular approaches in the present. Due to its attached values for these groups or societies, cultural heritage is maintained in the present and bestowed for the benefit of future generations. At the same time, the concept of cultural heritage developed as a result of complex historical processes and is constantly evolving.<br>The Cultural Heritage Studies Program combines theoretical and practical education, offering a variety of theoretical and methodological approaches with a strong emphasis on practical knowledge and skills based on fieldwork, and internships with local, regional and global heritage organizations.<br><br>Historical approach, present social relevance (policy and management), and the integration of cultural and natural heritage issues are the three pillars of the program.<br><br>The program offers a global viewpoint within local Central European heritage contexts (capital of culture, World Heritage sites, urban environmental imperatives, local issues of conflicting interests)<br><br>One of the principles CEU is based on is respect for the diversity of cultures and peoples. As the University attracts students and faculty from 100 countries from around the world, it is an ideal host of a cultural heritage program dealing with disparate traditions, practices and social interactions.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "In addition to the general CEU admission requirements applicants to the two-year MA program in Cultural Heritage Studies: Academic Research, Policy, Management are required to submit (in English) a 1500-word project proposal.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "124",
                        "courseID": 5
                    },
                    {
                        "courseName": "Master of Arts in Economic Policy in Global Markets",
                        "description": "This two-year program focuses on economic policy in the context of global markets. The main goal of this program is to provide students with an understanding of economic policy process and to provide them with analytical ability to evaluate policy making issues.<br><br>During the first year, students will focus on core courses in macroeconomics, microeconomics, quantitative analysis, and applied economic policy analysis as well as some optional courses. In the second year, students will be able to choose from a wide range of optional courses as for example Corporate Finance; Economic and Financial Regulations; Industrial Policy; Health Policy; Economic Policy in Emerging Markets.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "In addition to meeting the General CEU Admissions Requirements, applicants to the MA in Economic Policy program must submit the Statement of Purpose that should express the applicant’s reasons for applying to the program (1-2 pages). Applicants should indicate how further studies at CEU would help them achieve their future career goals.<br><br>Entry is open for students with undergraduate degree in economics or related fields, and also for students with undergraduate or master degrees from areas not directly related to economics. More information about the program will be announced in due course on the department’s website.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 6
                    },
                    {
                        "courseName": "Master of Arts in Economics",
                        "description": "The first year of the program serves as an introduction to the core areas of standard economics and provides a firm foundation for further studies. The second year offers advanced and specialized field courses that students choose according to their research interests.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "In addition to meeting the General CEU Admissions Requirements, applicants to the MA programs must submit a 500-word essay introducing their research topic and explaining their academic/professional background. Applicants should indicate how further studies at CEU would help them achieve their future career goals. In addition, applicants must either:<br>• pass a department-specific examination in basic calculus, probability theory and linear algebra, or<br>• submit general GRE test scores.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 7
                    },
                    {
                        "courseName": "Master of Arts in European Women's and Gender History (MATILDA)",
                        "description": "Established as part of the EU Erasmus programme, the MATILDA European Master in Women’s and Gender History is designed for students wishing to develop expertise in women’s and gender history, as well as European history, and who are interested in intercultural exchange.<br><br>The programme of study is spread over two years, includes 120 ECTS points, and links four leading European universities in an exciting, innovative and unique venture. Students can expect to study at least two different partner institutions (a ‘home’ and a ‘host’ institution), choosing from among the following:<br><br>    University of Vienna (coordinating institution)<br>    The Central European University (CEU) in Budapest<br>    The Universite Lumiere Lyon 2<br>    The Sofia University St. Kliment Ohridski",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "In addition to meeting CEU’s general entry requirements, MATILDA applicants should possess a BA in a humanities/social science subject and are required to submit the following documents:<br><br>    One Motivation Letter in English<br>    Two letters of academic reference (in closed envelopes or per email)<br>    A recent CV",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 8
                    },
                    {
                        "courseName": "Master of Arts in Gender Studies",
                        "description": "The program offers a comprehensive focus of study for students with a first degree in a traditional discipline and some prior knowledge in gender analysis. Students undertake coursework in an interdisciplinary range of mandatory and elective classes that examine gender in symbolic, social and theoretical terms. Coursework is followed by an independent, original research component—a Master's thesis written under the supervision of two faculty members. Fellowships and tuition waivers are available.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "MA students do not need to have a prior degree in gender or women's studies, however, successful applicants tend to have had some exposure to gender as a body of scholarly knowledge and discipline in addition to a sensitivity to its social impact. Applicants should have a genuine interest in developing their knowledge and scholarly perspectives beyond the individual disciplines they have studied at the undergraduate (or Master's) level.<br><br>In addition to meeting the General CEU Admissions Requirements, applicants should submit a 500-word statement of purpose describing:<br>• their interest in the field of gender studies and in the program of the Department of Gender Studies<br>• any relevant experience (academic, professional or personal), and the expected significance of their studies at CEU for their future career goals",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "credits": "80",
                        "courseID": 9
                    },
                    {
                        "courseName": "Master of Arts in Global Economic Relations",
                        "description": "This joint program with the department of Economics integrates training in international relations with economics. It provides students with the knowledge and analytical skills to prepare and evaluate economic policies and strategic decision-making in a global setting. This program is fee-based only.<br><br>This innovative and interdisciplinary program integrates training in international relations and economics. The program focuses on deepening theoretical understanding and enhancing students’ skills and knowledge in data analysis, global politics and global economic affairs.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "In addition to meeting the General CEU Admissions Requirements, applicants must submit a one-page statement of purpose, and a 500-word essay.<br><br>The statement of purpose should describe the applicant's previous studies and/or research undertaken. It should also include some explanation as to how this has motivated the application to IRES, as well as how the MA potentially fits into future work or studies.<br><br>The focus of the essay should demonstrate knowledge on a specific topic; for example, a particular writer's work, a theory or school of thought, or an empirical case, and demonstrate how this topic, from the perspective of International Relations or a related social science discipline, would relate to the applicant's future studies and research in the department.<br><br>Accepted applicants come from a wide variety of academic backgrounds, although preference is given to students with a degree in the social sciences (including history, political science, law and philosophy). However, others with a demonstrated interest in international affairs and public policy may also be strong candidates for admission.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "credits": "80",
                        "courseID": 10
                    },
                    {
                        "courseName": "Master of Arts in Human Rights",
                        "description": "Since its foundation in 1998 the MA in Human Rights Program remains the first in the region to offer graduate education in international and European human rights law to students from various parts of the world, including Central and Eastern Europe, the former Soviet Union and the Balkans. In recent years the number of students from Africa, the Americas and from Asia has increased considerably. The MA in Human Rights Program recruits applicants from all disciplines, who wish to understand the theoretical and policy implications of defending human rights and acquire the skills for successful human rights protection and advocacy.<br><br>The interdisciplinary MA in Human Rights degree combines social science, policy-based approach with legal science, thus non-lawyers are given an opportunity to benefit from a curriculum with a legal focus. Teaching is designed to incorporate both theoretical perspectives and concrete empirical analyses of the most important questions in human rights. The program offers practical instruction in the specific legal mechanisms and institutional processes which may be used by national human rights organizations to effectively approach human rights issues that transitional and also established democracies might confront. Courses familiarize students with the key legal concepts and enable them to use basic legal reasoning and comparative arguments. Areas of research and teaching cover – among others – international mechanisms for the protection of human rights, with particular focus on the Council of Europe and the United Nations, freedom of expression and freedom of religion, human rights and criminal justice, political rights, non-discrimination, minority protection, human rights and development politics, human rights in Africa, and the constitutional protection of rights on a basic level. Rigorous and closely monitored coursework provides the tools of analysis, critical reading and writing skills to enable students to make a significant and lasting contribution both to the protection of rights in their home countries and to enforcement of human rights at large.<br><br>The program benefits from a close cooperation with the Open Society Justice Initiative, the Open Society Foundations and leading Budapest-based NGOs which offer internship opportunities to selected students.",
                        "tuitionFee": "6500",
                        "deadline": "01/02/2018",
                        "requirements": "All applicants must fulfill the general requirements of CEU.<br><br>Applicants must demonstrate proficiency in English by submitting standardized English language test scores, e.g., the Test of English as a Foreign Language (TOEFL) or other substitute tests listed at the language requirements section of the CEU website.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "credits": "84",
                        "courseID": 11
                    },
                    {
                        "courseName": "Master of Arts in International Relations (1 year)",
                        "description": "The one-year MA program builds on the strong tradition of international relations scholarship in North America, the UK, and Western Europe. The aim of the program is to enable students to both explain and understand material, military, economic as well as ideational factors for continuity and change in the international political system. In doing so, although therefore necessarily global in its outlook, the department is also committed to a particular focus on the European context. In addition to exposure to the main areas of teaching in the program, students will also receive thorough preparation in academic writing and research design.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "In addition to meeting the General CEU Admissions Requirements, applicants must submit a one-page statement of purpose, and a 500-word essay. The statement of purpose should describe the applicant’s previous studies and/or research undertaken. It should also include some explanation as to how this has motivated the application to IR, as well as how the MA potentially fits into future work or studies. The focus of the essay should demonstrate knowledge on a specific topic; for example, a particular writer’s work, a theory or school of thought, or an empirical case, and demonstrate how this topic, from the perspective of international relations or a related social science discipline, would relate to the applicant’s future studies and research in the department.<br><br>Accepted applicants come from a wide variety of academic backgrounds, although preference is given to students with a degree in the social sciences (including history, political science, law and philosophy). However, others with a demonstrated interest in international affairs and public policy may also be strong candidates for admission.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "credits": "80",
                        "courseID": 12
                    },
                    {
                        "courseName": "Master of Arts in International Relations (2 years)",
                        "description": "The program is intended for students who have graduated from a three-year undergraduate program and would like to proceed with their studies more thoroughly, possibly with a view of a preparing themselves for a doctoral degree.<br><br>The two-year MA Program in International Relations combines rigorous theoretical and methodological academic training in international relations with area expertise.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "In addition to meeting the General CEU Admissions Requirements, applicants must submit a one-page statement of purpose, and a 500-word essay.<br><br>The statement of purpose should describe the applicant's previous studies and/or research undertaken. It should also include some explanation as to how this has motivated the application to IRES, as well as how the MA potentially fits into future work or studies.<br><br>The focus of the essay should demonstrate knowledge on a specific topic; for example, a particular writer's work, a theory or school of thought, or an empirical case, and demonstrate how this topic, from the perspective of International Relations or a related social science discipline, would relate to the applicant's future studies and research in the department.<br><br>Accepted applicants come from a wide variety of academic backgrounds, although preference is given to students with a degree in the social sciences (including history, political science, law and philosophy). However, others with a demonstrated interest in international affairs and public policy may also be strong candidates for admission.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 13
                    },
                    {
                        "courseName": "Master of Arts in Late Antique, Medieval and Early Modern Studies",
                        "description": "The name of the program has been  changed in February 2017. The old name, MA in Medieval Studies  would continue to apply to those enrolled before fall 2017.<br><br>This program grants a degree in advanced medieval studies as a whole. It serves those who come with a developed research agenda and sufficient background knowledge. Students take courses in several fields and write an MA thesis demonstrating their ability to conduct independent research and use primary source(s) competently.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "Applicants for the two-year MA in Historical Studies must have a minimum three years of BA studies and those applying for the one-year MA in Medieval Studies a minimum of four years of study in history, art history, archaeology, philosophy, philology or one of the relevant source languages. In addition to meeting the General CEU Admissions Requirements, applicants are also required to submit a 500-word description of their proposed research topic, specifying the primary sources and related secondary literature. Applicants may also be required to take a source language examination.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "credits": "80",
                        "courseID": 14
                    },
                    {
                        "courseName": "Master of Arts in Nationalism Studies (1 year)",
                        "description": "The program addresses the question of what constitutes the nation, analyzes its organization and considers the meaning of ‘nationalism’ as it applies to individual identity. Key to the study of nationalism is an interdisciplinary approach that includes political science, history, anthropology, sociology, and international relations. To this end, students of the one-year MA program, in addition to completing courses within the Nationalism Studies Program, are also required to attend courses offered by other CEU departments. The breadth of study allows students to construct a multidimensional picture of what the nation is, how it functions, why it is relevant, and why it is so often at the heart of conflict.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "Candidates must have completed a minimum of four years with a BA degree. Applicants to the Master’s program must meet the General CEU Admissions Requirements, and submit a 500-word outline of their proposed research topic and one writing sample, e.g., a term paper of minimum ten pages. If possible, candidates should submit a writing sample that is in some way related to the topic of nationalism.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "credits": "80",
                        "courseID": 15
                    },
                    {
                        "courseName": "Master of Arts in Nationalism Studies (2 years)",
                        "description": "The program is specifically designed for applicants with a three-year BA. While offering an open and critical perspective on nationhood, it aims to engage students in areas like nationalism and the media or nationalism and minority protection.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "Candidates fmust have completed at least a three-year BA degree. Applicants to the Master’s program must meet the General CEU Admissions Requirements, and submit a 500-word outline of their proposed research topic and one writing sample, e.g., a term paper of minimum ten pages. If possible, candidates should submit a writing sample that is in some way related to the topic of nationalism.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "No Available",
                        "courseID": 16
                    },
                    {
                        "courseName": "Master of Arts in Philosophy (1 year)",
                        "description": "The programs cover most of the major areas of philosophy, from a mainly analytic perspective. It will be possible for candidates who have a four-year Bachelor of Arts degree to take the Master’s degree in one year.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "Candidates will normally be expected to have some background in philosophy. In addition to meeting the General CEU Admissions Requirements, applicants will also be required to submit a statement of purpose (1-2 single spaced pages) as well as a sample of academic writing—part of a course essay or a chapter of a thesis—in English, to further assess their language abilities and argumentation skills.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "credits": "80",
                        "courseID": 17
                    },
                    {
                        "courseName": "Master of Arts in Philosophy (2 years)",
                        "description": "The programs cover most of the major areas of philosophy, from a mainly analytic perspective. It will be possible for candidates who have a four-year Bachelor of Arts degree to take the Master’s degree in one year. Courses related to all the major periods in the history of philosophy are available for the two-year program.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "Candidates will normally be expected to have some background in philosophy. In addition to meeting the General CEU Admissions Requirements, applicants will also be required to submit a statement of purpose (1-2 single spaced pages) as well as a sample of academic writing—part of a course essay or a chapter of a thesis—in English, to further assess their language abilities and argumentation skills.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "124",
                        "courseID": 18
                    },
                    {
                        "courseName": "Master of Arts in Political Science (1 year)",
                        "description": "The One-year MA Program in Political Science offers a comprehensive and interdisciplinary curriculum in theory and research methods in contemporary political science. US standards in research and teaching are combined with the varied requirements of an international student body. The program is aimed for students who graduated a four-year BA degree. The program invites students who wish to develop the analytical skills necessary to achieve excellence in politics and economics of democratization in a comparative perspective, international development, comparative and European politics, current issues in the theory and practice of constitutional democracy, political theory, political sociology, and political economy. The MA program targets both future academics and students who wish to pursue careers in non-academic jobs requiring considerable skills in social and political analysis, typically in the civil service, the news media, NGOs, political and cultural organizations, and private businesses. ",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "Candidates for the One-year MA Program must have at least four-years university education prior to joining CEU. Successful applicants usually hold a first degree in economics, history, law, political science or sociology, although other degrees will be given equal consideration. Students seeking admission to the Political Science Department’s MA program must meet the General CEU Admissions Requirements and submit:<br><br>    a 100-word statement of purpose describing the reason(s) why they are applying to the program<br>    a short (approximately 500 words) exposition of an issue or problem in political science in which they are interested<br>    samples of previous writings and/or a list of scholarly publications and relevant research experience (as applicable). Note that these materials will not be kept, commented on or returned by the department.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "credits": "80",
                        "courseID": 19
                    },
                    {
                        "courseName": "Master of Arts in Political Science (2 years)",
                        "description": "The Two-year MA Program in Political Science specifically addresses the needs of students who have a three-year study background in political science (or a related discipline) and would like to gain a more structured and comprehensive knowledge about contemporary political theory, European politics, and different research methodologies and empirical skills necessary for the practice of political science. At the same time, the high number and great variety of elective courses give students the opportunity to deepen their knowledge in their chosen field of specialization such as comparative politics, political economy, political communication, or political theory.  The MA program targets both future academics and students who wish to pursue careers in non-academic jobs requiring considerable skills in social and political analysis, typically in the civil service, the news media, NGOs, political and cultural organizations, and private businesses.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "The two-year MA program accepts students who, by the time of enrolling, have received at least three years of prior higher education and a Bachelor’s degree (worth at least 180 ECTS credits) in the field of political science or other social science disciplines, economics, philosophy, public policy, or public administration. Those students that lack a political science background will be required to take remediary classes in their first year in order to gain a basic understanding of the discipline. Students seeking admission to the Political Science Department’s MA program must meet the General CEU Admissions Requirements and submit:<br><br>• a 100-word statement of purpose describing the reason(s) why they are applying to the program<br><br>• a short (approximately 500 words) exposition of an issue or problem in political science in which they are interested<br><br>• samples of previous writings and/or a list of scholarly publications and relevant research experience (as applicable).",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "No Available",
                        "courseID": 20
                    },
                    {
                        "courseName": "Master of Arts in Public Policy",
                        "description": "The program combines a strong basis in the core subjects of public policy with specialization in selected policy areas. Courses combine analysis and critical thinking with problem-solving. Students work on<br>both academic research papers and problem-oriented policy briefs, using quantitative and qualitative research methods.<br><br>Students may choose an area of concentration during the one-year MAPP program. The Areas of Concentration are:<br>• Development<br>• Security<br>• Governance<br>• Media and Communication<br>• Higher Education Policy",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "One-year MAPP students are required to complete 40 CEU credits (32 course credits of mandatory, mandatory/elective and elective courses + 8 dissertation credits). At the end of the teaching terms, one-year MAPP students will write a research thesis under the guidance of a faculty member who will serve as the Thesis Supervisor. The one-year MAPP program also has a mandatory practice component that may be fulfilled via an internship or participation in the Applied Policy Lab. Students must do one or the other.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "credits": "80",
                        "courseID": 21
                    },
                    {
                        "courseName": "Master of Arts in Sociology and Social Anthropology",
                        "description": "The primary goal of the program is to enable students to deepen and broaden their knowledge of theoretical and methodological approaches to the study of social pheonomena, structures and processes. In a wide range of courses on social theory, migration, religion, ethnicity, cultural policies, economic sociology, globalization, dynamics of modernity, institutional change, urban processes and gender relations, students are encouraged to articulate individual positions with regard to bridging the two disciplines in the topics they study. One of the main endeavors of the program is to develop the research skills of students by offering solid training in methodology.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "In addition to meeting the General CEU Admissions Requirements (see: https://www.ceu.edu/apply), applicants must provide a:<br><br>    500-word outline of their proposed research topic (1.5 spaced) for their MA thesis. The thesis topic should fall within the broad thematic focus of the department and the areas of interest of its faculty. Previous work in relevant fields as well as research experience in related areas, if any should be also mentioned. Your MA proposal should specify your proposed MA research project, and why you think you and the project are a good fit for our department. This can include specifying your proposed topic and methods; a brief literature review which situates your project within existing scholarly work; the social relevance of your project to the world at large; and reference to your proposed project's suitability to CEU's Department of Sociology and Social Anthropology. We strongly encourage you to visit the CEU's Center for Academic Writing site. For further guidance on how to write a research proposal: http://caw.ceu.edu/online-writing-resources#Genres <br>    2 recommendation letters<br>    writing sample in English (for example a chapter from the undergraduate thesis) is required.<br><br>Please note that we only conduct interviews for shortlisted PHD applicants. The department may want to do this by phone, skype or in person. MA applicants are usually not interviewed.<br><br>For information on financial aid policy for MA applicants, please visit CEU’s policy on financial aid. Questions regarding university-level financial aid policies can be directed to the financial aid office.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "credits": "88",
                        "courseID": 22
                    },
                    {
                        "courseName": "Master of Arts in Sociology and Social Anthropology, with an optional specialization in Global and Urban Studies",
                        "description": "Two-Year MA program in Sociology and Social Anthropology with optional specialization in Global and Urban Studies<br><br>The Two-Year MA requires that students take a total of 48 credits, of these 38 credits in coursework. (14 credits for the Thesis Consultation and Defense are not included in the required 48 credits!) In the first year a minimum of 30 credits is to be undertaken. A further 8 credits may be taken in the fall semester of the second year. All coursework must be completed before undertaking research for the thesis in the Winter Semester of the second year.<br><br>For those without specialization 20 course credits come from mandatory courses and 18 from elective courses.<br><br>For those specializing in Global and Urban Studies 28 course credits come from mandatory courses and 10 from elective courses and at least six of the ten elective credits have to be chosen from the Urban and Global Studies Electives Cluster of courses, offered in both Fall and Winter. Please check the MA one-year electives for other options.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "In addition to meeting the General CEU Admissions Requirements (see: https://www.ceu.edu/apply), applicants must provide a:<br><br>    500-word outline of their proposed research topic (1.5 spaced) for their MA thesis. The thesis topic should fall within the broad thematic focus of the department and the areas of interest of its faculty. Previous work in relevant fields as well as research experience in related areas, if any should be also mentioned. Your MA proposal should specify your proposed MA research project, and why you think you and the project are a good fit for our department. This can include specifying your proposed topic and methods; a brief literature review which situates your project within existing scholarly work; the social relevance of your project to the world at large; and reference to your proposed project's suitability to CEU's Department of Sociology and Social Anthropology. We strongly encourage you to visit the CEU's Center for Academic Writing site. For further guidance on how to write a research proposal: http://caw.ceu.edu/online-writing-resources#Genres <br>    2 recommendation letters<br>    writing sample in English (for example a chapter from the undergraduate thesis) is required.<br><br>Please note that we only conduct interviews for shortlisted PHD applicants. The department may want to do this by phone, skype or in person. MA applicants are usually not interviewed.<br><br>For information on financial aid policy for MA applicants, please visit CEU’s policy on financial aid. Questions regarding university-level financial aid policies can be directed to the financial aid office.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "No Available",
                        "courseID": 23
                    },
                    {
                        "courseName": "Master of Laws in Comparative Constitutional Law",
                        "description": "The Comparative Constitutional Law Program at CEU Legal Studies was established in 1992, and remains the only LLM program of its kind in the world. Over the years the Program had students from Central and Eastern Europe, the Balkans, North America, while more recently we have been also having an increase in the number of students from Africa and the Americas.<br><br>Constitutional problems at the time of transition to democracy and constitutional design have been explored in the program ever since its foundation. The shift in the curriculum towards issues concerning the development and strengthening of good government in a globalized world reflects our commitment to the broader international context in which contemporary constitutional systems operate. The core curriculum centers on fundamental issues in comparative government and constitutional rights protection in leading and emerging democracies around the world. Since its establishment the curriculum of the program has examined the legal traditions of both civil law (continental) and common law systems.<br><br>As all programs at the Department of Legal Studies, we are also committed to research-based teaching. Areas of research and teaching cover subjects in transition to democracy and the rule of law, constitution-making in historical perspective and in on-going processes, comparative constitutional adjudication, civil and political rights in established and emerging democracies, freedom of religion and free speech in a global world, broadcasting law, biomedical law and reproductive rights, enforcement of socio-economic rights, European Union law with emphasis on institutional law and select advanced subjects, constitutional transplants and comparative administrative law.<br>Our highly qualified and diverse faculty prepares students to engage in comparative and inter-disciplinary analysis of complex constitutional problems. Courses prepare students to explore constitutional issues across legal systems, to engage in critical reading and refine their arguments in oral interactions. Individual research skills are developed and furthered through comparative problem papers and group work. Students are encouraged to lace theoretical insights from the literature with concerns and lessons from practice. Our graduates are thus able to respond to challenging constitutional and fundamental rights problems with advanced analytical skills, offering comparative insight and policy-relevant responses.<br><br>Over the years the Comparative Constitutional Law Program has educated many high-ranking civil servants, successful NGO and IGO professionals and academics. We are proud that our academic community is chosen by many visiting and exchange students predominantly from North America and all parts of Europe. With their diverse background, rich academic and professional experience they contribute greatly to the success of our educational program.",
                        "tuitionFee": "6500",
                        "deadline": "01/02/2018",
                        "requirements": "All applicants must fulfill the general requirements of CEU.<br><br>Applicants must demonstrate proficiency in English by submitting standardized English language test scores, e.g., the Test of English as a Foreign Language (TOEFL) or other substitute tests listed at the language requirements section of the CEU website.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "LLM",
                        "credits": "56",
                        "courseID": 24
                    },
                    {
                        "courseName": "Master of Laws in Human Rights",
                        "description": "Since its foundation the Human Rights Program has been offering quality graduate level education to students from various parts of the world, including Central and Eastern Europe, former Soviet Union and the Balkans. In recent years the number of students from Africa, the Americas and Asia has increased considerably. The LL.M. in Human Rights degree is designed for students holding a law degree. The Program aims at training future legal scholars and practitioners in human rights and also serves the already established professionals who wish to add a human rights perspective to their work.<br><br>From its inception the main goal of the Human Rights Program has been to provide theoretical and practical training for future scholars and professionals in human rights, with special emphasis on the legal aspects of human rights protection. While the program is interdisciplinary in nature, it is strongly focused on comparative legal analysis. Teaching is designed to incorporate both theoretical perspectives and concrete empirical analyses of the most important questions in human rights. The program offers practical instruction in the specific legal mechanisms and institutional processes which may be used by national human rights organizations to effectively approach human rights issues that transitional and also established democracies might confront. Rigorous and closely monitored coursework provides the tools of analysis, critical reading and writing necessary to enable students to make a significant and lasting contribution both to the rights protection in their home countries and to enforcement of human rights at large. Areas of research and teaching cover – among others – constitutional and international mechanisms for the protection of human rights, with particular focus on the Council of Europe and the United Nations, freedom of expression and freedom of religion, human rights and criminal justice, political rights, non-discrimination, minority protection, human rights in Africa, politics and theories of European integration from a human rights perspective.<br><br>The program benefits from a close cooperation with the Open Society Justice Initiative, the Open Society Foundations and the leading Budapest-based NGOs which offer internship opportunities to selected students.",
                        "tuitionFee": "6500",
                        "deadline": "01/02/2018",
                        "requirements": "All applicants must fulfill the general requirements of CEU.<br><br>Applicants must demonstrate proficiency in English by submitting standardized English language test scores, e.g., the Test of English as a Foreign Language (TOEFL) or other substitute tests listed at the language requirements section of the CEU website.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "LLM",
                        "credits": "84",
                        "courseID": 25
                    },
                    {
                        "courseName": "Master of Laws in International Business Law",
                        "description": "At the time of its establishment in 1991, the primary focus of the International Business Law Program at the Department of Legal Studies was on transition towards market economy. In two decades’ time this emphasis has shifted and the curriculum has become more diversified. It is focusing on the legal setting of business transactions in a transnational environment, on the players, and on the regulatory framework of international business. The courses are dealing with present-day issues and practical problems. Special attention is devoted to various methods and techniques of dispute settlement. The Program is also a certified course provider for the Chartered Institute of Arbitrators. The LL.M. degree in International Business law remains highly attractive to applicants holding a law degree, who wish to continue an international career in legal practice or in academia.<br><br>In order to enable graduate students from all over the world to cope with such increasingly interdisciplinary and cross-border legal challenges, the curriculum of the International Business Law Program rests on several building blocks rather than on a single specialization. These include dispute resolution (e.g., international commercial arbitration, conflict of laws), international business law (e.g., GATT & WTO, EU law or drafting and negotiating in the transnational context), regulation of business (e.g., capital market and securities regulation, consumer protection) and comparative business law (e.g., comparative national company, bankruptcy and secured transaction laws). Additionally, the program constantly strives to offer courses that deal with contemporary global, regional and local challenges, like doing business in Asia, reform of secured transactions laws in Central and Eastern Europe and elsewhere. Most courses are of comparative nature typically juxtaposing the laws of leading common law and civilian legal systems with those of emerging markets.<br><br>For an international student our unprecedentedly diverse student body as well as faculty is a key advantage. Given the high faculty-student ratio and the interactive teaching method, this diverse student body is the key also to learning from each other and understanding that there is more than one way of approaching any legal issue.<br><br>The IBL Program is especially proud of the prominent careers of its graduates. The alumni of the IBL Program could now be found not just in offices of leading international and local law firms, as in-house counsels of international corporations, as well as in the positions of university teachers, governmental officials, experts of regulatory bodies or even in the non-profit sector.",
                        "tuitionFee": "6500",
                        "deadline": "01/02/2018",
                        "requirements": "All applicants must fulfill the general requirements of CEU.<br><br>Applicants must demonstrate proficiency in English by submitting standardized English language test scores, e.g., the Test of English as a Foreign Language (TOEFL) or other substitute tests listed at the language requirements section of the CEU website.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "LLM",
                        "credits": "56",
                        "courseID": 26
                    },
                    {
                        "courseName": "Master of Public Administration (2 years)",
                        "description": "The two-year Master of Public Administration program integrates three components: Knowledge, Skills, and Practice. In addition to taking core courses in public policy analysis, the rule of law, economics, and research methods, students have the opportunity to develop and apply thematic expertise through specialist tracks within the program. These are: Security; Development; Governance; Media and Communication; and Higher Education Policy. In the Spring terms, MPA students participate in a series of Skills For Impact modules that develop emotional intelligence, awareness, leadership, negotiation and teambuilding capacities, as well as practical skills such as media training and documentary film making. These are intended for student application during their MPA program, as well as post-graduation employment.  The third program component is the Applied Policy Project, a nine month engagement between student teams and an external client that enables students to bridge classroom and experiential learning in a consultancy style format that is supported by the Project Director, a Faculty Adviser and the client organization.<br><br>For more information about the MPA program, admission requirements, and how to apply, visit: spp.ceu.edu",
                        "tuitionFee": "7250",
                        "deadline": "01/02/2018",
                        "requirements": "Applying to the Master of Public Administration (MPA) is a two-step process consisting of a written application followed by an interview upon invitation. ",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MPA",
                        "credits": "144",
                        "courseID": 27
                    },
                    {
                        "courseName": "Master of Science in Business Analytics",
                        "description": "Business Analytics is where data science meets business strategy. This advanced and practice oriented program, will enhance students' ability to use data analytics and machine learning to extract quantitative insight and build predictive models as well as make evidence-based decisions. Courses on network science, strategy management or behavioral economics will broaden the understanding of data driven decision-making. Learning about data architecture, big data computing and technology management will prepare for managing data as a strategic asset.",
                        "tuitionFee": "7500",
                        "deadline": "01/02/2018",
                        "requirements": "A minimum of four years spent in higher education. A bachelor's (or higher) degree from a reputable institution in business, economics, statistics, computer science, engineering. mathematics, social sciences, the physical sciences or other quantitative-oriented fields is generally required.<br><br>Admission is based on previous studies including specific courses, professional experience, a statement of purpose, and letters of recommendation.<br><br>More information about the admissions process and required application documents: https://economics.ceu.edu/program/master-science-business-analytics/admissions",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "credits": "No Available",
                        "courseID": 28
                    },
                    {
                        "courseName": "Master of Science in Business Analytics",
                        "description": "Business Analytics is where data science meets business strategy. This advanced and practice oriented program, will enhance students' ability to use data analytics and machine learning to extract quantitative insight and build predictive models as well as make evidence-based decisions. Courses on network science, strategy management or behavioral economics will broaden the understanding of data driven decision-making. Learning about data architecture, big data computing and technology management will prepare for managing data as a strategic asset.",
                        "tuitionFee": "7500",
                        "deadline": "01/02/2018",
                        "requirements": "A minimum of four years spent in higher education. A bachelor's (or higher) degree from a reputable institution in business, economics, statistics, computer science, engineering. mathematics, social sciences, the physical sciences or other quantitative-oriented fields is generally required.<br><br>Admission is based on previous studies including specific courses, professional experience, a statement of purpose, and letters of recommendation.<br><br>More information about the admissions process and required application documents: https://economics.ceu.edu/program/master-science-business-analytics/admissions",
                        "language": "English",
                        "programType": "Part Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "No Available",
                        "courseID": 29
                    },
                    {
                        "courseName": "Master of Science in Environmental Sciences and Policy",
                        "description": "The program provides students with a combination of scientific, technological, legal and policy training,preparing them for careers in a wide range of environmental fields. The aim is to give students an understanding of all aspects of the environment, of how to develop sound and sustainable policies, and of matters related to solving environmental problems.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "In addition to meeting the General CEU Admissions Requirements applicants to either of the two Master’s programs must write a statement (maximum 350 words) addressing:<br><br>1) the origins of their interest in environmental issues;<br><br>2) how they hope to benefit from the program;<br><br>3) their future career plans;<br><br>and 4) their relevant special interests.<br><br>Previous work or practical experience in the field of environmental sciences is highly desirable but students from a variety of backgrounds are encouraged to apply, provided they show a commitment to environmental issues.Students holding a first degree from a variety of other fields (from natural and earth sciences to economics or law) are also encouraged to apply.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "credits": "72",
                        "courseID": 30
                    },
                    {
                        "courseName": "Master of Science in Finance",
                        "description": "Advance your career with the MS in Finance guided by industry. Embrace the rapid evolution of finance, learn new strategies, data tools and technologies, and grow your professional network. Study Full time as a graduate or career changer, or part-time as a working professional.<br><br>The MS in Finance combines a professional finance curriculum with additional cutting-edge offerings in data analytics, technology skills and legal studies to prepare for tomorrow's leadership roles.<br><br>You will learn from leading professors and industry professionals, and develop your applied skills through case studies and simulations. The MS in Finance Advisory Committee is a group of senior executives setting professional standards and guiding the program.<br><br>MS in Finance graduates are sought after by global employers seeking international talent. Budapest ranks among the European Union's fastest rising financial services and technology hubs and best places for expats. Global employers working in English include Bank of China, BCG, BlackRock, Citi, ExxonMobil, GE, IBM, McKinsey, Morgan Stanley, MSCI, PwC and Vodafone, among many others.<br><br>Combine the MS in Finance with the MS in Technology Management and Innovation. Earn two degrees and become a FinTech leader, or develop your own FinTech startup in our award-winning incubator, the CEU InnovationsLab.<br><br>Extend your studies free of tuition with prestigious exchange partner schools in the Americas, Asia and Europe.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "Motivation Letter or Statement of Purpose expressing the applicant’s reasons for applying to the program (1-2 pages)<br>    GMAT or GRE General Test or CEU Math Test<br>    Admission Interview<br><br>We can start processing your application once you have submitted your CEU Application Form, CV, and Motivation Letter. For any outstanding documents please upload a Microsoft Word document stating the expected date of receipt.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "credits": "60",
                        "courseID": 31
                    },
                    {
                        "courseName": "Master of Science in Finance",
                        "description": "Advance your career with the MS in Finance guided by industry. Embrace the rapid evolution of finance, learn new strategies, data tools and technologies, and grow your professional network. Study Full time as a graduate or career changer, or part-time as a working professional.<br><br>The MS in Finance combines a professional finance curriculum with additional cutting-edge offerings in data analytics, technology skills and legal studies to prepare for tomorrow's leadership roles.<br><br>You will learn from leading professors and industry professionals, and develop your applied skills through case studies and simulations. The MS in Finance Advisory Committee is a group of senior executives setting professional standards and guiding the program.<br><br>MS in Finance graduates are sought after by global employers seeking international talent. Budapest ranks among the European Union's fastest rising financial services and technology hubs and best places for expats. Global employers working in English include Bank of China, BCG, BlackRock, Citi, ExxonMobil, GE, IBM, McKinsey, Morgan Stanley, MSCI, PwC and Vodafone, among many others.<br><br>Combine the MS in Finance with the MS in Technology Management and Innovation. Earn two degrees and become a FinTech leader, or develop your own FinTech startup in our award-winning incubator, the CEU InnovationsLab.<br><br>Extend your studies free of tuition with prestigious exchange partner schools in the Americas, Asia and Europe.",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "Motivation Letter or Statement of Purpose expressing the applicant’s reasons for applying to the program (1-2 pages)<br>    GMAT or GRE General Test or CEU Math Test<br>    Admission Interview<br><br>We can start processing your application once you have submitted your CEU Application Form, CV, and Motivation Letter. For any outstanding documents please upload a Microsoft Word document stating the expected date of receipt.",
                        "language": "English",
                        "programType": "Part Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "60",
                        "courseID": 32
                    },
                    {
                        "courseName": "Master of Science in Mathematics and its Applications (1 year)",
                        "description": "The CEU Mathematics Department offers an One Year Master of Science (MS) program in Mathematics and its Applications, accredited in the US, in cooperation with the Alfréd Rényi Institute of Mathematics, Hungarian Academy of Sciences, home of Abel Prize laureate Endre Szemerédi. In order to broaden the perspectives for students, the department collaborates closely with other universities in Budapest. Upon graduation, the MS program enables students to continue their study for PHD at some prestigious universities around the World in mathematics or science on the one hand, or to become high profile professionals in fields applying for example statistics, financial mathematics or bioinformatics on the other hand.<br><br>As a community of students, faculty and staff, theDepartment of Mathematics and its Applications is committed to academic freedom, equal access to education and collegial self-governance. Our ultimate aim is to enable our diverse student body to become successful and influential professional scientists in the future social and academic life of their home countries and abroad.<br><br>Our M.S. program is unique since:<br><br>    It is an international graduate program in English in Central Europe.<br>    The program can benefit from the opportunities offered by the rich local academic environment, including the Alfréd Rényi Institute of the Hungarian Academy of Sciences (HAS), the Budapest University of Technology and Economics (BME), the Computer and Automation Research Institute of the HAS, and the Eötvös Loránd University (ELTE).",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "Applicants are required to submit a one-page statement of purpose describing their interest in mathematics, achievements and future goals. In addition, they have to prove familiarity with fundamental undergraduate material, by taking either a Mathematics Exam or the GRE Subject Test in Mathematics. In addition, candidates passing the threshold set by the department for the written tests will be interviewed.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "credits": "70",
                        "courseID": 33
                    },
                    {
                        "courseName": "Master of Science in Mathematics and its Applications (2 years)",
                        "description": "The name of the program has been  changed in February 2015. The old name, MS in Applied Mathematics  would continue to apply to those enrolled before fall 2015.<br><br>The objectives of this program are to offer students who hold a BA or BSc degree with a major in mathematics or a neighboring field:<br><br>    an opportunity to expand their knowledge in several fields of mathematics and its applications by providing courses at graduate level<br>    a unique academic experience via a high-quality, international program taught in English<br>    for those wishing to continue their studies in the PHD program, the MS program provides comprehensive knowledge in the field of applied mathematics",
                        "tuitionFee": "6000",
                        "deadline": "01/02/2018",
                        "requirements": "Applicants must have earned a (three- or four-year) first degree (i.e., BA or BSc), with a major in mathematics or a related field (e.g., computer science, engineering, physics), from a recognized university or institution of higher education, or provide documentation indicating that they will earn such a degree by the time of enrollment.<br><br>In addition to meeting the General CEU Admissions Requirements, applicants are also required to submit a one-page statement of purpose describing their interest in mathematics, their achievements to date and their future goals. In addition, they must prove familiarity with fundamental undergraduate material.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 34
                    },
                    {
                        "courseName": "Master of Science in Technology Management and Innovation",
                        "description": "The name of the program has been  changed in June 2016. The old name, Master of Science in Information Technology Management would continue to apply to those enrolled before fall 2016.<br><br>The MS in Technology Management and Innovation program is unique in the region of Central and Eastern Europe. It is designed mainly for managers or prospective managers with a technical background who need to develop the business, finance and leadership skills for advancement or entrepreneurship.<br><br>The program is interactive and hands-on education and delivered by industry experts as well as academic faculty members.<br><br>This is not a technical program, but a business program aimed at participants with a technical background. It provides a bridge between technical expertise and the business needs of every kind of organization.",
                        "tuitionFee": "5000",
                        "deadline": "01/02/2018",
                        "requirements": "Program specific requirements:<br><br>    Motivation Letter: The Motivation Letter or Statement of Purpose should express the applicant’s reasons for applying to the MSc program (1-2 pages).<br><br>    GMAT or GRE General Test or CEU Mathematics test:<br><br>The GMAT or GRE General Test can be replaced by the CEU Mathematics test: The format, courselength and difficulty of the test is comparable to the quantitative section of the GMAT. If you are well prepared for the GMAT, you will also succeed in the CEU Math test. Please see a sample test here. The CEU Math test can be taken online, after submission of the online application.<br><br>Applicants who have at least 5 years of work experience, and are at least 30 years of age, may be considered for an exemption from the GMAT/GRE/Math test requirement.<br><br>For official enrollment, CEU must receive official score reports in hard copies to be sent to CEU directly from the testing institutions. (GRE institutional code: 0069)<br><br>    Video testimony:<br><br>Applicants are asked to prepare a 2-3 minute video, in which they provide an answer to the following questions:<br><br>    Tell us what you like most about your current work/school;<br>    Give an example of an occasion, when you faced a digital transformation challenge. It is ok if you did not overcome it; identifying the challenges is the crucial first step in learning.<br>    After you finish the CEU MS in Technology Management and Innovation program, how will your life be different? Give us two examples.<br><br>Please include the link to your video in your motivation letter.<br><br>Occasionally, interviews may be conducted on the phone, through Skype, or in person, depending on the applicant's availability.<br><br>Please note that acceptance for or enrollment in CEU's part-time programs does not entitle a student to a student visa or residence permit. Therefore, if you are accepted for a part-time MSc program, you will need to hold relevant resident status in Hungary on another account such as employment, marriage, etc.",
                        "language": "English",
                        "programType": "Part Time",
                        "courselength": "1 years",
                        "degreeType": "MA",
                        "credits": "60",
                        "courseID": 35
                    },
                    {
                        "courseName": "Doctor of Juridical Science",
                        "description": "The Doctoral Program of the Department of Legal Studies offers a unique opportunity to conduct independent research, complete doctoral-level course work and gain experience with teaching and other academic activities. The Department of Legal Studies welcomes doctoral projects on topics pertaining to our research and teaching areas. Applicants holding a law degree and an additional master’s degree qualify for an SJD degree offered by the Department of Legal Studies.<br><br>The Doctoral Program aims to provide an opportunity to promising young scholars to conduct comparative research into a complex problem in comparative constitutional law, international business law or human rights which has both profound theoretical and practical relevance. Supervision for doctoral projects is provided by our international permanent and visiting faculty. In addition to conducting independent research doctoral students benefit from doctoral courses, research grants enabling further research at renowned law schools or research institutions, opportunities for supervised teaching and a wide range of other doctoral activities (such as conferences, workshops, summer schools).<br><br>Physical presence in Budapest is required during the first three years of the SJD program, except for research periods abroad. The SJD degree is awarded on the basis of completion of the credit requirements from course work and other doctoral activities, and the successful public defense of the doctoral thesis (dissertation) before a panel composed of internal and external experts.<br><br>Our doctoral graduates have been successful in obtaining post-graduate research positions and teaching appointments at leading academic institutions. We are also proud to know senior NGO and international law firm personnel among our doctoral alumni.",
                        "tuitionFee": "8000",
                        "deadline": "01/02/2018",
                        "requirements": "Applicants holding a law degree and an LL.M. degree are requested to visit http://legal.ceu.edu/CCL_SJD_admissions (for comparative constitutional law and human rights projects) or http://legal.ceu.edu/IBL_SJD_admissions (for projects in international business law) for further information on the SJD program.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3-6 years",
                        "degreeType": "SJD",
                        "credits": "180",
                        "courseID": 36
                    },
                    {
                        "courseName": "Doctor of Philosophy in Business Administration",
                        "description": "The primary aim of the PHD program in Business Administration at CEU Business School is to produce graduates who will have academic careers dealing with a diverse range of business subjects and challenges, teaching and conducting research. There will be a particular emphasis in this program on specific academic competencies that exist within CEU Business School, such as innovation/entrepreneurship, business and society, and advanced general management (including management and strategy). A particularly favorable target audience for this program comprises PHD applicants from and/or having interest in bringing best management thinking and research to business schools and other relevant academic units in institutions of higher education located in emerging and transitional economies, including Central and Eastern Europe (CEE). A key set of outcomes that will be associated with this program will be the success of our PHD graduates in teaching and conducting research in business associated with emerging economies. The likely career path of our PHD graduates, therefore, will be largely within faculties of business schools mostly associated with these regions.",
                        "tuitionFee": "10000",
                        "deadline": "01/02/2018",
                        "requirements": "In addition to meeting the General CEU Admissions Requirements, applicants must submit:<br>• a research proposal of 1500-2000 words<br>• two letters of recommendation<br>• GRE or GMAT test scores",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "PHD",
                        "credits": "124",
                        "courseID": 37
                    },
                    {
                        "courseName": "Doctor of Philosophy in Cognitive Science",
                        "description": "The PHD program in cognitive science is a research-oriented program. It includes training in experimental methods and, mainly in the first year, coursework on the basic notions and theories in cognitive science and a possible focus on social cognition and cognitive social sciences. During the research period, students will develop into independent researchers, with the ability to contribute to cognitive science with analyzes and empirical data.<br><br>Doctoral enrollment may continue up to a maximum of six years. Students admitted into CEU doctoral programs are eligible to receive the CEU Doctoral Fellowship for up to three years. Numerous additional funding opportunities exist.",
                        "tuitionFee": "7500",
                        "deadline": "01/02/2018",
                        "requirements": "Applicants are expected to hold an internationally recognized Master's or comparable degree in the standard disciplines that constitute cognitive science ( psychology, computer science, philosophy, engineering, biology, neuroscience, physics and mathematics). A comparable degree in other Social Sciences, Humanities, or other disciplines will also be considered in case of an excellent academic record. In case of exceptional candidates, we will also consider the applications if the student only holds a Bachelor degree, provided it is in a discipline closely associated to cognitive science.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3-6 years",
                        "degreeType": "PHD",
                        "credits": "180",
                        "courseID": 38
                    },
                    {
                        "courseName": "Doctor of Philosophy in Comparative Gender Studies",
                        "description": "The PHD program seeks to contribute to the development of studies in gender which are interdisciplinary, integrative, and grounded in analyses of social processes, theories, institutions and the material conditions of life. The program aims to promote the study of gender and its correspondence with categories such as class, ethnicity, race and sexual orientation, and to do research on diversified patterns of social and cultural change. Thus, students are encouraged to understand the complexity of gender. They will combine the critique of androcentrism with a critique of Eurocentric perspectives and epistemologies, particularly—but not exclusively—in Central and Eastern Europe. Within this framework, gender is understood as an element and product of processes of global, regional and local development.",
                        "tuitionFee": "7500",
                        "deadline": "01/02/2018",
                        "requirements": "In addition to meeting the General CEU Admissions Requirements applicants must submit three letters of recommendation and a three-page research proposal. A research focus that complements the orientation of the department and/or faculty research interests is particularly welcome. In order to be eligible for admission into the doctoral program, applicants must hold a graduate (Master's) degree in any field.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3-6 years",
                        "degreeType": "PHD",
                        "credits": "180",
                        "courseID": 39
                    },
                    {
                        "courseName": "Doctor of Philosophy in Comparative History",
                        "description": "The department especially welcomes students with PHD dissertation research that contributes to:<br><br>    the integration of the study of different layers of historical processes (social, cultural, economic, political)<br>    the integration of history and theory (conscious reflection of the basic approaches of research)<br>    comparative approaches in historiography (Central, Southeastern and Eastern Europe being neither different and incomparable, nor a belated copy of developments elsewhere)<br><br>The advantages of the CEU doctoral program are the classes and discussions among students specializing in different topics, different periods, and different geographical regions whereby new research questions can be formulated, even about one’s own national history.  The research being undertaken by our current PHD students and the successful dissertations already defended give the best idea of what is possible at the CEU History doctoral program.",
                        "tuitionFee": "7500",
                        "deadline": "01/02/2018",
                        "requirements": "In addition to meeting the general CEU admissions requirements, applicants should submit letters of recommendation from three professors familiar with their post-graduate work and a three-page research proposal ( see sample proposal 1 and sample proposal 2 ).<br><br> The topic of the proposal should fall within the broad thematic focus of the program as described above, and should address issues of method and substance, as well as previous work done in the field, in appropriate detail. Applications are welcome from candidates with a Master’s degree that includes a Master’s thesis. <br><br>Applicants interested in Nationalism Studies or Jewish Studies at the doctoral level can apply for a Ph.D. in History and should follow the general admissions requirements for the History doctoral program; a joint committee reviews applications.  The degree received will be a Ph.D. in History.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3-6 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 40
                    },
                    {
                        "courseName": "Doctor of Philosophy in Economics",
                        "description": "The aim of the PHD program is to prepare professional economists for research, teaching or government service careers. Coursework in the program is designed to ensure that students acquire rigorous knowledge in the core areas of economic theory and research methodology. During the research period, students will develop into independent researchers, with the ability to contribute to the analysis of fundamental economic questions facing transition and market economies.<br><br>Doctoral enrollment may continue up to a maximum of six years. Students admitted into CEU doctoral programs are eligible to receive a generous CEU Doctoral Fellowship and full tuition waiver for up to three years; the tuition waiver is provided for the whole duration of the program. Numerous additional funding opportunities exist, such as the Doctoral Research Support Grant Program, the Erasmus Mobility Scheme, and various research and travel funds.",
                        "tuitionFee": "8500",
                        "deadline": "01/02/2018",
                        "requirements": "In addition to meeting the General CEU Admissions Requirements, applicants must submit:<br>• a 500-word research proposal<br>• three letters of recommendation<br>• general GRE<br><br>Successful applicants usually possess an MA (or equivalent) in economics (or a related field).",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3-6 years",
                        "degreeType": "PHD",
                        "credits": "180",
                        "courseID": 41
                    },
                    {
                        "courseName": "Doctor of Philosophy in Environmental Sciences and Policy",
                        "description": "The Environmental Sciences and Policy Department is a center of excellence in environment-related scholarship and teaching in Europe, our program is a unique opportunity to:<br><br>    Pursue meaningful research that addresses some of the most urgent environmental challenges facing the world today.<br>    Earn a Ph.D. in 3 + years (min. 3 years; maximum 6 years).<br>    Receive full scholarship support for up to 36 months of study.<br>    Join a truly global network and become a member of the CEU international community.<br>    Live in an exciting European city and make new life-long friends.<br><br>We welcome ALL applications demonstrating strong academic standing and qualified English language skills that fit within the department's research profile, including:<br><br>    Environmental policy and governance<br>    Environmental sociology and political ecology<br>    Global and regional environmental processes<br>    Natural resources management and sustainable agriculture<br>    Sustainable energy systems",
                        "tuitionFee": "7500",
                        "deadline": "01/02/2018",
                        "requirements": "Applicants for the Doctoral Program are required to possess a Master's degree or equivalent in an environment-related field, such as natural or social sciences, engineering, economics, law or management. They must also meet the relevant language proficiency and CEU admissions requirements. The Department's admission criteria include intellectual excellence and the potential for making original contributions to knowledge in the field through rigorous research. Further information and advice about entry into the PHD program is available here:https://www.ceu.edu/admissions<br><br>Please note that, in addition to standard CEU admissions requirements, the department requires applicants to submit a (max 2,000 word) research proposal as well as a statement of purpose (max 500 words). In your statement of purpose it is advisable to name the potential supervisor. This is an important part of the selection process, since we use it to form a judgement both about the applicant's ability to conduct PHD-level research and about his/her fit with the department's research profile; applicants are therefore encouraged to pay particular attention to this element of their application package.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3-6 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 42
                    },
                    {
                        "courseName": "Doctor of Philosophy in Late Antique, Medieval and Early Modern Studies",
                        "description": "The doctoral program in Late Antique, Medieval and Early Modern Studies offers an entry into historical worlds not often conjoined. The major aims of the program are to encourage transdisciplinary medievalist research, open new perspectives and develop new approaches. Indeed, the research conducted by CEU PHD candidates often acts as a bridge between the scholarly worlds of their home intellectual communities and Anglo-American scholarly discourse, a fact in which the department takes pride. High-level knowledge of the source language(s) their research requires is an entry requirement for PHD applicants. Students admitted to CEU doctoral programs are eligible to receive the CEU Doctoral Fellowship for up to three years. Doctoral enrollment may continue up to a maximum of six years.<br><br>Numerous additional funding opportunities exist, such as the Doctoral Research Support Grant Program, the Erasmus Mobility Scheme, and various research and travel funds.",
                        "tuitionFee": "7500",
                        "deadline": "01/02/2018",
                        "requirements": "In addition to meeting the General CEU Admissions Requirements, applicants must submit:<br>• a three-page outline of their Master’s thesis in English<br>• evidence of the interdisciplinary character of their previous medieval studies and familiarity with the research methods they wish to apply<br>• a three-page dissertation proposal plus a two-page feasibility study – consult the departmental website for advice.<br><br>Applicants may also be required to take a source language examination.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3-6 years",
                        "degreeType": "PHD",
                        "credits": "180",
                        "courseID": 43
                    },
                    {
                        "courseName": "Doctor of Philosophy in Mathematics and its Applications",
                        "description": "The program offers an innovative curriculum encompassing both traditional mathematics and cuttingedge contemporary applications. It is designed to ensure that students acquire rigorous and state-ofthe-art knowledge and to offer research opportunities under expert supervision.",
                        "tuitionFee": "7500",
                        "deadline": "01/02/2018",
                        "requirements": "In addition to meeting the General CEU Admissions Requirements, applicants for the PHD program must submit a one-page statement describing their interest in mathematics, their achievements to date and their future goals. Applicants are expected to hold an MS or MSc with a major in mathematics or a related field such as physics, engineering or computer science. Applicants must have a solid mathematical background.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3-6 years",
                        "degreeType": "PHD",
                        "credits": "108",
                        "courseID": 44
                    },
                    {
                        "courseName": "Doctor of Philosophy in Network Science",
                        "description": "The PHD program in Network Science is a research-oriented program. It includes training in theoretical and computational methods and coursework on the basic notions and theories of complex networks including hands-on experience with large datasets. Students will have the opportunity to focus on specific related fields, like mathematics, sociology, political science or environmental science. During their research work they will participate in international research projects and by the end of their PHD studies they will develop into independent researchers, with the ability to contribute to network science with analyzes and modeling empirical data.<br><br>Doctoral enrollment may continue up to a maximum of six years. Students admitted into CEU doctoral programs are eligible to receive the CEU Doctoral Fellowship for up to three years. Numerous additional funding opportunities exist.",
                        "tuitionFee": "7500",
                        "deadline": "01/02/2018",
                        "requirements": "We expect applications from candidates with an interest in network science and/or its applications to political science, economics, sociology and environmental sciences. The program is hosted by the Department of Network and Data Science.<br><br>    Masters degree in: Physics, Mathematics, Computer Science, Sociology, Political Science, Economics or equivalent<br>    Strong interest in interdisciplinary research<br>    Detailed account of earlier studies (courses, results)<br>    Motivation letter<br>    Names and email addresses of two reference persons",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3-6 years",
                        "degreeType": "PHD",
                        "credits": "180",
                        "courseID": 45
                    },
                    {
                        "courseName": "Doctor of Philosophy in Philosophy",
                        "description": "Doctoral enrollment may continue up to a maximum of six years. Students admitted into CEU doctoral programs are eligible to receive a full CEU Doctoral Fellowship for up to three years. Numerous additional funding opportunities exist, such as the Doctoral Research Support Grant Program, the Erasmus Mobility Scheme, and various research and travel funds.",
                        "tuitionFee": "7500",
                        "deadline": "01/02/2018",
                        "requirements": "Candidates must have a first degree in philosophy and a background in the history of philosophy (e.g. major ancient and medieval thinkers, Cartesianism, British empiricism and classical German philosophy) and in logic (propositional and predicate). In addition to meeting the General CEU Admissions Requirements, applicants must submit a short statement of purpose (between 1-2 pages single-spaced), indicating their proposed research and an essay of 2,000–4,000 words on an appropriate philosophical topic. The essay should discuss a philosophical problem of the applicant’s own choice; it can, but need not, be related to the applicant’s studies or to the topic of the applicant’s proposed research.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3-6 years",
                        "degreeType": "PHD",
                        "credits": "60",
                        "courseID": 46
                    },
                    {
                        "courseName": "Doctor of Philosophy in Political Science - Track: Comparative Politics",
                        "description": "The structure of the PHD program in Political Science is based on a system of ‘tracks’ (areas of specialization, or ‘majors’). The tracks represent academic fields/sub-fields or research areas that reflect the major strengths and interests of our faculty.",
                        "tuitionFee": "7500",
                        "deadline": "01/02/2018",
                        "requirements": "Applicants are expected to hold an internationally recognized Master’s or comparable degree in Political Science, International Relations, Public Policy, or a similar politics- and/or policy related program that provides a relevant academic background for the track to which the candidate applies. A comparable degree in other Social Sciences, Humanities, or other disciplines will also be considered in case of an excellent academic record.<br>In their online application package, applicants to the Doctoral Program in Political Science need to submit the following documents (School-specific requirements are bolded):<br><br>    Completed online CEU application form;<br>    two confidential letters of recommendation (academic); <br>    relevant undergraduate and graduate transcripts and diplomas;<br>    a full curriculum vitae or resume, including a list of publications, if any;<br>    a max. 500-word statement of purpose<br>    a max.1 500-word research proposal (excl. references, bibliography);<br>    a max. 500-word summary of a submitted or planned MA thesis or other substantial academic work;<br>    proof of relevant English language competency.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3-6 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 47
                    },
                    {
                        "courseName": "Doctor of Philosophy in Political Science -- Track: International Relations",
                        "description": "The structure of the PHD program in Political Science is based on a system of ‘tracks’ (areas of specialization, or ‘majors’). The tracks represent academic fields/sub-fields or research areas that reflect the major strengths and interests of our faculty.",
                        "tuitionFee": "7500",
                        "deadline": "01/02/2018",
                        "requirements": "Applicants are expected to hold an internationally recognized Master’s or comparable degree in Political Science, International Relations, Public Policy, or a similar politics- and/or policy related program that provides a relevant academic background for the track to which the candidate applies. A comparable degree in other Social Sciences, Humanities, or other disciplines will also be considered in case of an excellent academic record.<br>In their online application package, applicants to the Doctoral Program in Political Science need to submit the following documents (School-specific requirements are bolded):<br><br>    Completed online CEU application form;<br>    two confidential letters of recommendation (academic); <br>    relevant undergraduate and graduate transcripts and diplomas;<br>    a full curriculum vitae or resume, including a list of publications, if any;<br>    a max. 500-word statement of purpose<br>    a max.1 500-word research proposal (excl. references, bibliography);<br>    a max. 500-word summary of a submitted or planned MA thesis or other substantial academic work;<br>    proof of relevant English language competency.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3-6 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 48
                    },
                    {
                        "courseName": "Doctor of Philosophy in Political Science -- Track: Political Economy",
                        "description": "The structure of the PHD program in Political Science is based on a system of ‘tracks’ (areas of specialization, or ‘majors’). The tracks represent academic fields/sub-fields or research areas that reflect the major strengths and interests of our faculty.",
                        "tuitionFee": "7500",
                        "deadline": "01/02/2018",
                        "requirements": "Applicants are expected to hold an internationally recognized Master’s or comparable degree in Political Science, International Relations, Public Policy, or a similar politics- and/or policy related program that provides a relevant academic background for the track to which the candidate applies. A comparable degree in other Social Sciences, Humanities, or other disciplines will also be considered in case of an excellent academic record.<br>In their online application package, applicants to the Doctoral Program in Political Science need to submit the following documents (School-specific requirements are bolded):<br><br>    Completed online CEU application form;<br>    two confidential letters of recommendation (academic); <br>    relevant undergraduate and graduate transcripts and diplomas;<br>    a full curriculum vitae or resume, including a list of publications, if any;<br>    a max. 500-word statement of purpose<br>    a max.1 500-word research proposal (excl. references, bibliography);<br>    a max. 500-word summary of a submitted or planned MA thesis or other substantial academic work;<br>    proof of relevant English language competency.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3-6 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 49
                    },
                    {
                        "courseName": "Doctor of Philosophy in Political Science -- Track: Political Theory",
                        "description": "The structure of the PHD program in Political Science is based on a system of ‘tracks’ (areas of specialization, or ‘majors’). The tracks represent academic fields/sub-fields or research areas that reflect the major strengths and interests of our faculty.",
                        "tuitionFee": "7500",
                        "deadline": "01/02/2018",
                        "requirements": "Applicants are expected to hold an internationally recognized Master’s or comparable degree in Political Science, International Relations, Public Policy, or a similar politics- and/or policy related program that provides a relevant academic background for the track to which the candidate applies. A comparable degree in other Social Sciences, Humanities, or other disciplines will also be considered in case of an excellent academic record.<br>In their online application package, applicants to the Doctoral Program in Political Science need to submit the following documents (School-specific requirements are bolded):<br><br>    Completed online CEU application form;<br>    two confidential letters of recommendation (academic); <br>    relevant undergraduate and graduate transcripts and diplomas;<br>    a full curriculum vitae or resume, including a list of publications, if any;<br>    a max. 500-word statement of purpose<br>    a max.1 500-word research proposal (excl. references, bibliography);<br>    a max. 500-word summary of a submitted or planned MA thesis or other substantial academic work;<br>    proof of relevant English language competency.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3-6 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 50
                    },
                    {
                        "courseName": "Doctor of Philosophy in Political Science -- Track: Public Policy",
                        "description": "The structure of the PHD program in Political Science is based on a system of ‘tracks’ (areas of specialization, or ‘majors’). The tracks represent academic fields/sub-fields or research areas that reflect the major strengths and interests of our faculty.",
                        "tuitionFee": "7500",
                        "deadline": "01/02/2018",
                        "requirements": "Applicants are expected to hold an internationally recognized Master’s or comparable degree in Political Science, International Relations, Public Policy, or a similar politics- and/or policy related program that provides a relevant academic background for the track to which the candidate applies. A comparable degree in other Social Sciences, Humanities, or other disciplines will also be considered in case of an excellent academic record.<br>In their online application package, applicants to the Doctoral Program in Political Science need to submit the following documents (School-specific requirements are bolded):<br><br>    Completed online CEU application form;<br>    two confidential letters of recommendation (academic); <br>    relevant undergraduate and graduate transcripts and diplomas;<br>    a full curriculum vitae or resume, including a list of publications, if any;<br>    a max. 500-word statement of purpose<br>    a max.1 500-word research proposal (excl. references, bibliography);<br>    a max. 500-word summary of a submitted or planned MA thesis or other substantial academic work;<br>    proof of relevant English language competency.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3-6 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 51
                    },
                    {
                        "courseName": "Doctor of Philosophy in Sociology and Social Anthropology",
                        "description": "The PHD program does not have separate sociology and anthropology tracks—both disciplines are integrated. Students are encouraged to conduct empirical research using a wide variety of methodologies but theoretically informed approaches which embrace a broad intellectual agenda are prioritized. Of special interest are projects that promote: the integration of sociological and anthropological perspectives as well as methodologies; comparative approaches to urban processes; economic formations and transformations; research on social networks; generation of inequalities; meanings and practices of gender;transnational migration and dynamics of place-making; and social movements.<br><br>During the first year of the doctoral program, students undertake a rigorous, yet flexible program of coursework. Alongside mandatory courses developing epistemological and methodological approaches to sociology and social anthropology, elective courses provide in-depth studies of different subject areas. Students also have the option to undertake a semester-long Independent Study Module where a maximum of two students, under the supervision of one faculty member, devise a reading list related to their project.",
                        "tuitionFee": "7500",
                        "deadline": "01/02/2018",
                        "requirements": "Applicants should have an MA or equivalent in a social science discipline. Background in sociology and/or anthropology is a definite advantage. In addition to meeting the General CEU Admissions Requirements (see: http://www.ceu.edu/admissions/who-can-apply) applicants must submit:<br><br>    three letters of recommendation from professors who are familiar with their work<br>    a three page research proposal (1.5 spaced) that the proposal should address the main research questions, sources and methodology and place the topic in the context of previous research in the field.<br>    a short bibliography (one page) on the topic<br>    writing sample in English<br>    statement of purpose (maximum 500 words)<br><br>Applicants do not need to establish contact with potential supervisors. Once admitted, PHD students choose supervisors during their first year of study.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3-6 years",
                        "degreeType": "PHD",
                        "credits": "112",
                        "courseID": 52
                    }
                ],
                "scholarships": [{
                        "scholarshipID": "1",
                        "scholarshipName": "CEU Master’s Excellence Scholarship",
                        "description": "Covers the full cost of tuition and medical insurance. In addition, excellence scholarship recipients are awarded a monthly stipend of 96,000 HUF, designed to assist with the cost of meals and miscellaneous expenses. Single or shared housing in the CEU Residence Center is offered to a number of scholarship recipients based on academic merit. Students who permanently reside in Budapest are not eligible for CEU housing. Scholarship recipients who were awarded housing in the CEU’s Residence Center have the option to decline it. In such cases, however, CEU does not cover the costs of alternative accommodation.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship <br> See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "2",
                        "scholarshipName": "Erasmus Mobility Scheme",
                        "description": "Students enrolled at CEU wishing to spend three to 12 months studying at another country’s institution may be eligible for an Erasmus study grant. This grant contributes towards covering the difference in living expenses abroad.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "3",
                        "scholarshipName": "CEU Doctoral Scholarships",
                        "description": "The CEU Doctoral Scholarship covers tuition and medical insurance. In addition, recipients are awarded a monthly stipend of 220,000 HUF calculated to cover educational and accommodation costs (Economics and  Business Administration PhD students receive a monthly stipend of 250,000 HUF). Students need to budget additionally for travel, recreation, and incidentals.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "4",
                        "scholarshipName": "CEU General Alumni Scholarship",
                        "description": "Funded by donations from CEU graduates, the Alumni Scholarship is awarded to students who demonstrate a commitment to community service as well as the potential to help build strong CEU alumni communities around the world after graduation. This scholarship is only available for incoming students and awarded for one academic year.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "5",
                        "scholarshipName": "U.S. Federal Loan",
                        "description": "The U.S. government offers Federal Stafford Loan for U.S. citizens to assist them with their education costs during their studies at a university. “The Healthcare and Education Reconciliation Act of 2010” made several changes to the federal student aid programs. Beginning July 1, 2010, all new Stafford, PLUS, and Consolidation loans for eligible U.S. students can only be made under the so-called Federal Direct Loan Program. In this program the federal loan comes directly from the U.S. government and not from lenders.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "6",
                        "scholarshipName": "Butler Scholarship",
                        "description": "Awarded to Hungarian students pursuing an MA in Cultural Heritage Studies, who are committed to using their degrees to make a lasting impact as leaders in Hungary through cultural heritage management and policy.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "7",
                        "scholarshipName": "CEU-REF Scholarship",
                        "description": "For Roma students to study in one of CEU’s Masters programs.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "8",
                        "scholarshipName": "Deborah Harding Scholarship",
                        "description": "Awarded to a Roma student to enroll in the School of Public Policy’s one-year MA in Public Policy.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "9",
                        "scholarshipName": "Empiricus Scholarship",
                        "description": "Partial scholarship for high achieve students from mainland China, Hong Kong, Macau and Taiwan.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "10",
                        "scholarshipName": "Future of Big Data Scholarship & Training Program",
                        "description": "A scholarship and mentoring program for students pursuing the MSc in Business Analytics or the MSc in Finance, who are passionate about programming and data analysis (may be awarded as full or partial).",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "11",
                        "scholarshipName": "George Soros Leadership Fund",
                        "description": "Awarded to students from exceptional circumstances who embody open society ideals.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "12",
                        "scholarshipName": "Peter Hangartner Scholarship",
                        "description": "Covers the full cost of tuition and medical insurance. In addition, scholarship recipients are awarded a monthly stipend of 50,000 HUF,designed to assist with the cost of meals and miscellaneous expenses. Single or shared housing in the CEU Residence Center is offered to a number of scholarship recipients based on academic merit. Students who permanently reside in Budapest are not eligible for CEU housing. Scholarship recipients who were awarded housing in the CEU’s Residence Center have the option to decline it. In such cases, however, CEU does not cover the costs of alternative accommodation.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "13",
                        "scholarshipName": "Peter A. Nadosy Scholarship",
                        "description": "This scholarship is awarded annually to a Hungarian student entering a CEU MA program who demonstrates exceptional merit and financial need.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "14",
                        "scholarshipName": "South Balkan Scholarship",
                        "description": "Supporting students from Albania, Bulgaria, Former Yugoslav Republic of Macedonia, Greece, and Kosovo entering the School of Public Policy’s two-year MPA program.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "15",
                        "scholarshipName": "CEU Master’s Scholarship",
                        "description": "Covers the full cost of tuition and medical insurance. In addition, scholarship recipients are awarded a monthly stipend of 50,000 HUF,designed to assist with the cost of meals and miscellaneous expenses. Single or shared housing in the CEU Residence Center is offered to a number of scholarship recipients based on academic merit. Students who permanently reside in Budapest are not eligible for CEU housing. Scholarship recipients who were awarded housing in the CEU’s Residence Center have the option to decline it. In such cases, however, CEU does not cover the costs of alternative accommodation.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "16",
                        "scholarshipName": "Academic Awards",
                        "description": "CEU provides incentives for academic excellence and rewards those promising students who, with their work, have shown outstanding academic potential. Academic awards are granted to both master’s and doctoral students.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "17",
                        "scholarshipName": "Research and Travel Funds",
                        "description": "CEU believes in giving its students opportunities to access as much knowledge as possible. That is why the University provides Travel Grants for students, contributing to the cost of traveling abroad and attending academic conferences. All travel-related costs are covered, as well as conference fees, accommodation and administrative costs. In addition, Short-Research Grants help students enhance their dissertations. Doctoral students are eligible to receive one such award during their second or third year of study. Master’s students may receive such grants organized by their departments.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "18",
                        "scholarshipName": "Doctoral Research Support Grant",
                        "description": "The Doctoral Research Support Grant Program (DRSG) is designed to help students enrolled in CEU doctoral programs wishing to spend time researching or studying at another recognized university, institute, or research center.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "19",
                        "scholarshipName": "Praesidium Libertatis Scholarship at Leiden University",
                        "description": "CEU degree students who are currently enrolled may apply for the Leiden-CEU Praesidium Libertatis Scholarship that allows them to participate in graduate degree programs at Leiden University",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer.<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "20",
                        "scholarshipName": "Winter School Grant",
                        "description": "CEU funds a limited number of winter school grants each academic year for doctoral students who have passed their comprehensive examination and exceptional cases the committee will consider applications from 2nd year MA students.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer.<br>See scholarship description for further information on eligibility and special application requirements. Scholarships are awarded by CEU’s scholarship committee as part of the admissions and financial aid awarding process. Students are informed of any scholarship awards prior to matriculation, generally as part of the acceptance offer."

                    },
                    {
                        "scholarshipID": "21",
                        "scholarshipName": "Summer School Grant",
                        "description": "CEU degree students who are currently enrolled may apply for the Leiden-CEU Praesidium Libertatis Scholarship that allows them to participate in graduate degree programs at Leiden University",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "CEU funds a limited number of summer school grants each academic year for doctoral students who have passed their comprehensive examination. Doctoral students whose comprehensive exam is scheduled for the fall semester after completion of their first-year obligations may also be considered for the grant. The call for summer school grants is usually circulated via email towards the end of the winter semester."

                    }
                ]
            },
            {
                id: "5",
                "universityname": "Mcdaniels College",
                "aboutUniversity": "McDaniel College Budapest offers a number of dynamic major programs, from art history, business, and communication, to political science and psychology—a variety of majors for a variety of students. And McDaniel College is flexible: you can enter our program as undecided, sample a number of different courses, and then choose your major based on what you prefer. In addition, if you decide you would like to pursue a major different than the one you started, you can change majors—all of the credits you have earned remain on your record, and no time is lost for graduation. Finally, some of our majors can be pursued in combined dual major programs—art-communication, business-economics—that combine the best features of more than one major program in order to give students more options after graduation.",
                "generalRequirement": "",
                "data-keyword": "",
                "country": "Hungary",
                "student_payment": false,
                "application_url": "http://application.mcdaniel.hu/users/sign_up",
                "email":"admissions@mcdaniel.hu",
                "campusImgUrl": "",
                "universityProfilePic": "mcdaniels",
                "skypeID": "",
                "examinationPortal": "",
                "universityAddress": "",
                "universityLogo": "images/mcdaniel-logo.png",
                "visibility": "show",
                "courses": [{
                        "courseName": "Business Administration & Economics",
                        "description": "The Business Administration and Economics major provides quantitative, analytical, and creative skill necessary for careers in international business, accounting, law, as well as service in national and international agencies.<br>The Business/Economics major fosters an understanding and appreciation of economic forms of explanation, training students in economic theory and policy. At the same time, it prepares students to serve as principled, globally-minded business professionals, able to bridge management cultures and operate as key players in international networks. Small classes permit the one-on-one development of key statistical techniques, communication skills, and creative entrepreneurship necessary today around the world. Regular internships provide opportunities to integrate practice and theory.",
                        "tuitionFee": "3600",
                        "deadline": "15/07/2018",
                        "requirements": "Personal essay (at least 300 words)<br>        The purpose of this essay is to help us get acquainted with you as an individual and a student. Write about your family background, your upbringing, your years in school, your motivations in seeking admission into the degree program of McDaniel Budapest, your dreams, aspirations, career goals, and any topic or view that you would find important to share with us.<br>        Photocopy or official transcript from your senior high school, a Certificate of Final Examination, a Diploma of Graduation, or other documents verifying that you have completed your secondary education and are qualified for entry into an institution of higher education; test scores of American college-bound exams (SAT, ACT) if you graduated from high school in the United States, and a certified and authentic English translation of all documents originally issued in languages other than English.<br>        If you graduate from high school in the same year when you apply for admission, you do not have to wait with the application until you receive your Certificate of Final Examination or Diploma of Graduation. These documents can be submitted later as a supplement to your application.<br>        Two Letters of Recommendation in English from the principal or instructors of the secondary school from which you graduated;<br>        One passport-size photo;<br>        A medical certificate in English verifying that you do not suffer from any chronic diseases, and are physically and mentally capable of undertaking studies at an institution of higher education;<br>        Curriculum Vitae in English (attach as a separate page);<br>        Photocopy of the page in your passport containing your personal data.",
                        "language": "null",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "bachelor",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 0
                    },
                    {
                        "courseName": "Political Science & International Studies",
                        "description": "The major in Political Science and International Studies is designed to provide an understanding of political systems in general and of the American government, European affairs, and international relations in particular.<br>This major provides intellectual and practical preparation for public service, diplomacy, and journalism, and serves as a preparation for law studies and other graduate-level pursuits. Small classes permit students to hone their information literacy, research methods, and communication skills. McDaniel’s Budapest campus exposes students to a host of different cultures and international institutions, while its campus in Maryland provides a platform for work in Washington, D.C",
                        "tuitionFee": "3600",
                        "deadline": "15/07/2018",
                        "requirements": "Personal essay (at least 300 words)<br>        The purpose of this essay is to help us get acquainted with you as an individual and a student. Write about your family background, your upbringing, your years in school, your motivations in seeking admission into the degree program of McDaniel Budapest, your dreams, aspirations, career goals, and any topic or view that you would find important to share with us.<br>        Photocopy or official transcript from your senior high school, a Certificate of Final Examination, a Diploma of Graduation, or other documents verifying that you have completed your secondary education and are qualified for entry into an institution of higher education; test scores of American college-bound exams (SAT, ACT) if you graduated from high school in the United States, and a certified and authentic English translation of all documents originally issued in languages other than English.<br>        If you graduate from high school in the same year when you apply for admission, you do not have to wait with the application until you receive your Certificate of Final Examination or Diploma of Graduation. These documents can be submitted later as a supplement to your application.<br>        Two Letters of Recommendation in English from the principal or instructors of the secondary school from which you graduated;<br>        One passport-size photo;<br>        A medical certificate in English verifying that you do not suffer from any chronic diseases, and are physically and mentally capable of undertaking studies at an institution of higher education;<br>        Curriculum Vitae in English (attach as a separate page);<br>        Photocopy of the page in your passport containing your personal data.",
                        "language": "null",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "bachelor",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 1
                    },
                    {
                        "courseName": "Communication",
                        "description": "An interdisciplinary major, Communication deals with the function, processes, and analysis of human communication from one-on-one interactions to global networks.<br>Communication students are engaged in both analyzing and creating verbal, non-verbal, visual, and social messages and meanings. They learn to design messages for specific audiences, interpret mediated messages of all kinds, and act as mediators between different organizations and cultures. Small class sizes permit one-on-one work where Communication students learn how to create an effective social science study, and employ it in an individually-tailored research project. Communication internship and independent study opportunities give students the chance to apply their skills in journalistic forums and social media.",
                        "tuitionFee": "3600",
                        "deadline": "15/07/2018",
                        "requirements": "Personal essay (at least 300 words)<br>        The purpose of this essay is to help us get acquainted with you as an individual and a student. Write about your family background, your upbringing, your years in school, your motivations in seeking admission into the degree program of McDaniel Budapest, your dreams, aspirations, career goals, and any topic or view that you would find important to share with us.<br>        Photocopy or official transcript from your senior high school, a Certificate of Final Examination, a Diploma of Graduation, or other documents verifying that you have completed your secondary education and are qualified for entry into an institution of higher education; test scores of American college-bound exams (SAT, ACT) if you graduated from high school in the United States, and a certified and authentic English translation of all documents originally issued in languages other than English.<br>        If you graduate from high school in the same year when you apply for admission, you do not have to wait with the application until you receive your Certificate of Final Examination or Diploma of Graduation. These documents can be submitted later as a supplement to your application.<br>        Two Letters of Recommendation in English from the principal or instructors of the secondary school from which you graduated;<br>        One passport-size photo;<br>        A medical certificate in English verifying that you do not suffer from any chronic diseases, and are physically and mentally capable of undertaking studies at an institution of higher education;<br>        Curriculum Vitae in English (attach as a separate page);<br>        Photocopy of the page in your passport containing your personal data.",
                        "language": "null",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "bachelor",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 2
                    },
                    {
                        "courseName": "Art History & Studio Art",
                        "description": "The Studio Art/ Art History major provides students with the opportunity to develop their artistic and creative abilities while gaining a global perspective on the arts.<br><br>Apply Now<br><br>A critical approach to art in its social, historical, and cultural context complements students’ own creative work and process. Students learn to describe, analyze, and interpret the form and content of works of art, while examining the significant movements of Western art as well as the secular and sacred art of Asia, Africa, and the Americas. At the same time, students acquire an array of techniques for their own artistic self-expression, ranging from two and three-dimensional design, to computer graphics and web design, photography, painting, and sculpture. Classes are small and involve close work with our professors, and students benefit from a wealth of opportunities to view historic and contemporary art in a Budapest, a major European art center.",
                        "tuitionFee": "3600",
                        "deadline": "15/07/2018",
                        "requirements": "Personal essay (at least 300 words)<br>        The purpose of this essay is to help us get acquainted with you as an individual and a student. Write about your family background, your upbringing, your years in school, your motivations in seeking admission into the degree program of McDaniel Budapest, your dreams, aspirations, career goals, and any topic or view that you would find important to share with us.<br>        Photocopy or official transcript from your senior high school, a Certificate of Final Examination, a Diploma of Graduation, or other documents verifying that you have completed your secondary education and are qualified for entry into an institution of higher education; test scores of American college-bound exams (SAT, ACT) if you graduated from high school in the United States, and a certified and authentic English translation of all documents originally issued in languages other than English.<br>        If you graduate from high school in the same year when you apply for admission, you do not have to wait with the application until you receive your Certificate of Final Examination or Diploma of Graduation. These documents can be submitted later as a supplement to your application.<br>        Two Letters of Recommendation in English from the principal or instructors of the secondary school from which you graduated;<br>        One passport-size photo;<br>        A medical certificate in English verifying that you do not suffer from any chronic diseases, and are physically and mentally capable of undertaking studies at an institution of higher education;<br>        Curriculum Vitae in English (attach as a separate page);<br>        Photocopy of the page in your passport containing your personal data.",
                        "language": "null",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "bachelor",
                        "courselanguage": "English",
                        "credits": "No Available",
                        "courseID": 3
                    }
                ]
            },
            {
                id: "6",
                "universityname": "Semmelweis Medical University",
                "aboutUniversity": "Semmelweis University is a leading institution of higher education in Hungary and the Central European region within the area of medicine, health sciences. As a specialist university, it holds a unique place within the country; its prominent role is demonstrated by the fact that approximately 42 percent of Hungary’s doctors, 70 percent of its dentists, 50 percent of its pharmacists and 27 percent of its health care professionals are Semmelweis graduates.",
                "generalRequirement": "",
                "data-keyword": "",
                "country": "Hungary",
                "student_payment": false,
                "application_url": "https://semaphor.semmelweis.hu/",
                "email":"english.secretariat@semmelweis-univ.hu",
                "campusImgUrl": "",
                "universityProfilePic": "semmelweis",
                "skypeID": "",
                "examinationPortal": "",
                "universityAddress": "",
                "universityLogo": "images/semmelweis-log.png",
                "visibility": "show",
                "courses": [{
                        "courseName": "Nursing",
                        "description": "The  occupation  of  nurses  is  a  vocation  that  is  <br>pursued for the sake of health preservation, <br>promotion and patient healing. Nurses observe <br>patients in the hospital and continuously moni-<br>tor their needs, take part in disease prevention <br>and act as active contributors to the process <br>of  the  patient’s  recovery  and  rehabilitation.  <br>They help patients absorb and understand the <br>information on their health status. Nurses hold-<br>ing  a  BSc  degree  can  organise,  manage  and  <br>supervise  all  their  internal  medical,  surgical,  <br>obstetric<br>gynaecological,  psychiatric,  intensive  <br>nursing and primary care tasks in every area of <br>health  care.  They  are  responsible  for  conduct-<br>ing the healing- <br>nursing activities prescribed <br>by  the  physician,  and  help  the  patient  and  the  <br>physician perform certain examinations. Gradu-<br>ates of the speciality are able to provide health <br>care treatment for each age group from prema-<br>ture infants to elderly patients, explore the spe-<br>cial needs of the patient and the person cared <br>for,  prepare  nursing  diagnoses  and  perform  <br>the tasks professionally on the basis of prior-<br>ities,  participate  in  planning,  developing  and  <br>implementing health care and social services.",
                        "tuitionFee": "3100",
                        "deadline": "31/08/2018",
                        "requirements": "Online registration should be completed<br><br>Entrance exams are held regularly in Budapest and worldwide. Applicants will be informed about the place and date of the exams by the Faculty or by the official representative.<br><br>Entrance examinations consist of an English test, a test in Biology, writing of a Motivation letter and an oral interview.<br><br>The exams will be evaluated by the Faculty Board, and applicants will be notified about the results within three weeks.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "BA",
                        "credits": "240",
                        "courseID": 0
                    },
                    {
                        "courseName": "Dietetics",
                        "description": "Dietitians deal with the questions of human <br>nutrition and possess knowledge about healthy <br>diet and diseases caused by unhealthy nutri-<br>tion. Graduates are able to practise diet therapy <br>independently, or perform dietetic and catering <br>tasks as members of a therapist team. The <br>specialist’s  tasks  include  individual  and  group  <br>counselling, preventing nutrition related chronic <br>and non-contagious diseases, organising diet <br>plans according to the client’s sensitivity and <br>disease type. They manage catering units: lead <br>the catering service, organise catering work <br>procedures, and establish appropriate and <br>acceptable  conditions  for  catering.  Dietitians  <br>play an important role in teaching how to lead a <br>preventive  and  healthy  life  as  they  can  also  <br>develop and implement programmes for health <br>promotion.",
                        "tuitionFee": "3200",
                        "deadline": "31/08/2018",
                        "requirements": "Online registration should be completed<br><br>Entrance exams are held regularly in Budapest and worldwide. Applicants will be informed about the place and date of the exams by the Faculty or by the official representative.<br><br>Entrance examinations consist of an English test, a test in Biology, writing of a Motivation letter and an oral interview.<br><br>The exams will be evaluated by the Faculty Board, and applicants will be notified about the results within three weeks.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "BA",
                        "credits": "240",
                        "courseID": 1
                    },
                    {
                        "courseName": "Physiotherapy",
                        "description": "Physiotherapists act as autonomous practitioners <br>who  are  able  to  perform  functional  examinations, identify impairments, functional limitations, abilities and disabilities by using clinical <br>decision making processes. Physiotherapists <br>treat  patients  with  movement  therapy  and  <br>manual techniques as the professionals’ chief <br>task is to improve the functions of the musculo<br>skeletal system. The therapists develop <br>movement therapies and apply electro­-<br>therapeutic treatment, therapeutic <br>ultrasound, and different manual and <br>massage treatments for the sake <br>of  healing  and  rehabilitation  or  for  <br>the prevention of health damage. <br>Graduates take part in healing loco­<br>motor (orthopaedic, rheumatolo­gic, traumatologic), cardiovascular, <br>obstetrical,  gynaecological,  neurological  and  psychiatric  disorders.  <br>Prevention  and  health  promotion  <br>belong to the specialists’ profession, <br>too.  Physiotherapists  plan,  explain,  <br>carry out, and adapt an examination­<br>based  treatment,  draw  conclusions  <br>from the examination as a whole and <br>rank the main problems according to <br>priority.",
                        "tuitionFee": "3200",
                        "deadline": "31/08/2018",
                        "requirements": "Online registration should be completed<br><br>Entrance exams are held regularly in Budapest and worldwide. Applicants will be informed about the place and date of the exams by the Faculty or by the official representative.<br><br>Entrance examinations consist of an English test, a test in Biology, writing of a Motivation letter and an oral interview.<br><br>The exams will be evaluated by the Faculty Board, and applicants will be notified about the results within three weeks.<br><br>Entrance examinations consist of an English test, a test in Biology, writing of a Motivation letter and an oral interview.<br><br>The exams will be evaluated by the Faculty Board, and applicants will be notified about the results within three weeks.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "BA",
                        "credits": "240",
                        "courseID": 2
                    },
                    {
                        "courseName": "Midwifery",
                        "description": "Midwives fulfill caring and nursing tasks during <br>pregnancies, in the postpartum period and on <br>the occasion of gynaecological problems. Their <br>responsibilities are to monitor pregnancies, labours and the postpartum progress while cooperating with other healthcare professionals in <br>order to achieve the best possible outcome for <br>each family.  From the start of the parturition, <br>midwives prepare and continuously support and <br>encourage the woman during labour, monitor <br>the process of deliveries and the mother-infant <br>connection,  assess  and  register  their  observations.  Midwives  individually  assist  deliveries, <br>take care of the protection of the perineum and <br>of the treatment of the woman and the newborn  baby  during  the  post-delivery  period. <br>Graduate midwives look after, nurse and care <br>for female patients and perform the required <br>specialised treatment. State of the art skill laboratories help the preparation of the students <br>for their future profession.",
                        "tuitionFee": "3400",
                        "deadline": "31/08/2018",
                        "requirements": "Online registration should be completed<br><br>Entrance exams are held regularly in Budapest and worldwide. Applicants will be informed about the place and date of the exams by the Faculty or by the official representative.<br><br>Entrance examinations consist of an English test, a test in Biology, writing of a Motivation letter and an oral interview.<br><br>The exams will be evaluated by the Faculty Board, and applicants will be notified about the results within three weeks.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "BA",
                        "credits": "240",
                        "courseID": 3
                    },
                    {
                        "courseName": "Health Visitor",
                        "description": "The health visitor is present in the families’ life <br>during the most important steps of life: during <br>pregnancy, reception of the newborn baby, formation of family life and at the time of enrolment to nursery and elementary school. Graduates are able to provide counselling concerning family planning and parenthood, help and provide nursing care to the pregnant woman, and <br>perform screening tests. After the childbirth, the health visitor teaches the mother, the  ways  of  breastfeeding and her tasks related to the child. <br>They monitors the health condition and  development  of  neonates, provide community health care for children (aged 3–18), aid in the  prevention  of  behavioural disorders and bad habits, solve the problems of teenagers and direct them to the appropriate professional.<br> Health visitors give mental  hygiene  support  to  families  and  organise  vaccinations.  Health  visitors  take  part in  planning,  organising  and conducting health development and  promotion  programmes  for individuals and communities. They perform  their  duties  either  independently  or  in  cooperation  with  doctors and other medical experts.",
                        "tuitionFee": "3100",
                        "deadline": "31/08/2018",
                        "requirements": "Online registration should be completed<br><br>Entrance exams are held regularly in Budapest and worldwide. Applicants will be informed about the place and date of the exams by the Faculty or by the official representative.<br><br>Entrance examinations consist of an English test, a test in Biology, writing of a Motivation letter and an oral interview.<br><br>The exams will be evaluated by the Faculty Board, and applicants will be notified about the results within three weeks.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "BA",
                        "credits": "240",
                        "courseID": 4
                    },
                    {
                        "courseName": "Health Tourism Management",
                        "description": "Graduates of the training take part in organising <br>and managing health promotion activities, prepare <br>projects that aim at developing health tourism <br>and strengthening international cooperation, and <br>they participate in the implementation of tourism <br>development programmes of the European Union. <br>The  health  care  manager  is  a  versatile  professional who is proficient both in health care processes and in the field of tourism. Their acquired <br>knowledge  comprises  information  on  health,  <br>tourism and business, therefore they are not only <br>able to see through, organise and coordinate <br>the operation of health care institutions but with <br>appropriate business knowledge they are able to <br>market  and  manage  them,  too.  The  speciality  <br>provides  the  necessary  knowledge  to  create  <br>health tourism, health preservation, curative <br>and rehabilitation programmes.",
                        "tuitionFee": "3100",
                        "deadline": "31/08/2018",
                        "requirements": "Online registration should be completed<br><br>Entrance exams are held regularly in Budapest and worldwide. Applicants will be informed about the place and date of the exams by the Faculty or by the official representative.<br><br>Entrance examinations consist of an English test, a test in Biology, writing of a Motivation letter and an oral interview.<br><br>The exams will be evaluated by the Faculty Board, and applicants will be notified about the results within three weeks.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3.5 years",
                        "degreeType": "BA",
                        "credits": "210",
                        "courseID": 5
                    },
                    {
                        "courseName": "Optometry",
                        "description": "Optometrists are able to utilise their optic, optometric, measuring and clinical knowledge gained <br>during the training programme, conduct the <br>examination and correction of the eye individually <br>and prescribe optical aids (eyeglasses, contact <br>lenses)  with  the  aim  of  attaining  the  optimal  <br>visual acuity in patients. The professionals are able <br>to  estimate  the  refractive  medium,  refractive  <br>ability, errors of refraction, the way eye muscles <br>function,  and  the  ability  of  heterophoria  and  <br>convergence. They examine binocular vision, the <br>chamber  of  the  eye,  crystalline  lens,  vitreous  <br>humour and the eye fundus with the help of <br>a  slit  lamp,  and  they  estimate  ocular  tension.  <br>Optometrists  utilise  their  clinical  and  nursing  <br>knowledge during their daily activities, actively <br>participate in improving the culture of vision of <br>individuals,  communities  and  the  population.  <br>Through  examinations,  the  optometrist  recognises  and  evaluates  the  disorders  of  the  eye  <br>and so contributes to the immediate receipt of specialised care.",
                        "tuitionFee": "3100",
                        "deadline": "31/08/2018",
                        "requirements": "Online registration should be completed<br><br>Entrance exams are held regularly in Budapest and worldwide. Applicants will be informed about the place and date of the exams by the Faculty or by the official representative.<br><br>Entrance examinations consist of an English test, a test in Biology, writing of a Motivation letter and an oral interview.<br><br>The exams will be evaluated by the Faculty Board, and applicants will be notified about the results within three weeks.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "BA",
                        "credits": "240",
                        "courseID": 6
                    },
                    {
                        "courseName": "Master of Science (MSc) in Nursing",
                        "description": "Master’s level nurses characterise the health <br>status  of  the  population,  formulate  problems,  priorities  and  aims  in  public  health.  <br>They conduct research and analyse technical <br>literature,  interpret  the  results  of  modern  <br>statistical methods, perform tasks of organisation and management related to the nursing process. They are able to perform human <br>resource management tasks related to nursing.  Planning  budget  and  writing  tenders,  <br>planning, realising and evaluating programmes, and establishing cooperation between <br>institutions  and  individuals  belong  to  the  <br>tasks of nurses, too. The health care professionals are acquainted with the role and the <br>possibilities  of  the  improvement  of  health  <br>sciences in the life of society, and they are <br>able to characterise the health status of the <br>population.  Master’s  level  nurses  take  part  <br>in solving the scientific problems of nursing, <br>in finding new and constructing ideas about <br>the profession and in the promotion of their <br>practical usage.",
                        "tuitionFee": "3000",
                        "deadline": "31/08/2018",
                        "requirements": "Online registration should be completed<br><br>Entrance exams are held regularly in Budapest and worldwide. Applicants will be informed about the place and date of the exams by the Faculty or by the official representative.<br><br>Entrance examinations consist of an English test, a test in Biology, writing of a Motivation letter and an oral interview.<br><br>The exams will be evaluated by the Faculty Board, and applicants will be notified about the results within three weeks.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1.5 years",
                        "degreeType": "MA",
                        "credits": "90",
                        "courseID": 7
                    },
                    {
                        "courseName": "Master of Science (MSc) in Physiotherapy",
                        "description": "Master’s  level  physiotherapists  develop  therapeutic procedures and protocols based on their <br>extensive  national  and  international  knowledge and skills, recognise and analyse physical, <br>anatomical,  physiological  and  pathological  <br>factors affecting physical ability and capacity. <br>They participate in solving scientific problems <br>in physiotherapy, and finding new skills and <br>knowledge in their expertise. The specialists <br>perform scientific evaluation of the effectiveness of physiotherapeutic methods, organise <br>and  realise  clinical  research  in  physiotherapy,  <br>act as leaders in hospital units of physiotherapy, <br>apply fundamental regulations and quality <br>control principles in the management of health <br>institutions and private enterprises. The promotion of health education on local, community, <br>national  and  international  levels  also  belongs  <br>to the tasks of a physiotherapist.",
                        "tuitionFee": "3000",
                        "deadline": "31/08/2018",
                        "requirements": "Online registration should be completed<br><br>Entrance exams are held regularly in Budapest and worldwide. Applicants will be informed about the place and date of the exams by the Faculty or by the official representative.<br><br>Entrance examinations consist of an English test, a test in Biology, writing of a Motivation letter and an oral interview.<br><br>The exams will be evaluated by the Faculty Board, and applicants will be notified about the results within three weeks.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1.5 years",
                        "degreeType": "MA",
                        "credits": "90",
                        "courseID": 8
                    }
                ]
            },
            {
                id: "7",
                "universityname": "Budapest University of Technology and Economics",
                "aboutUniversity": "The Budapest University of Technology and Economics (BME) is a public higher education institute operating as a central budgetary institution. Its founding regulation has been issued by the Minister of Human Capacities. Its organizational and operational conditions are summarized in its own regulation in accordance with laws.",
                "generalRequirement": "Not Available",
                "data-keyword": "",
                "country": "Hungary",
                "student_payment": false,
                "application_url": "https://www.kth.bme.hu/regisztracio/language=en",
                "email":"admission@kth.bme.hu",
                "campusImgUrl": "",
                "universityProfilePic": "bme",
                "skypeID": "",
                "examinationPortal": "",
                "universityAddress": "",
                "universityLogo": "images/bme-logo.png",
                "visibility": "show",
                "courses": [{
                        "courseName": "Chemical Engineering",
                        "description": "The BSc degree course in chemical engineering provides the appropriate skills and knowledge in chemistry, chemical engineering and economic sciences. The degree holder should be able to manage chemical technologies, conduct analytical tests, intermediate and final quality control, and can take part in R&D, planning, and public administration. Part of the education is specialisation in a branch.",
                        "tuitionFee": "3200",
                        "deadline": "01/12/2018",
                        "requirements": "- secondary school leaving certificate;<br>- language skills proven by TOEFL, IELTS or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3.5 years",
                        "degreeType": "BA",
                        "credits": "210",
                        "courseID": 0
                    },
                    {
                        "courseName": "Civil Engineering",
                        "description": "The BSc engineering program in English leads to a BSc degree in four years, in the Branch of Structural Engineering. The branch offers specific educational objectives: Graduates from the Branch of Structural Engineering create engineering structures by utilizing and designing structural materials. They are expected to design, construct and organize the investments of mechanically, structurally and technologically complex structures in cooperation with architects and transport and hydraulics specialists. Future structural engineers who graduate from this branch will be able to design and construct, among other things, bridges and underground passages for traffic networks; power stations, cooling towers, craneways, transmission and telecommunication line structures; storehouses, industrial plants, and multi-storey buildings as well as hydraulic engineering and water supply structures.",
                        "tuitionFee": "3200",
                        "deadline": "01/12/2018",
                        "requirements": "- secondary school leaving certificate;<br>- language skills proven by TOEFL, IELTS or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "BA",
                        "credits": "240",
                        "courseID": 1
                    },
                    {
                        "courseName": "Computer Engineer",
                        "description": "The BSc Program in Computer Engineering is designed to give students a thorough understanding of the tools, methods, applications and practice of computer science and information technologies. It is both focused and practical in its orientation, with the goal to provide an education that is directly applicable to positions in industry. It is an integrated curriculum consisting of courses developed for the deeper theoretical understanding of the foundations of computer science as well as for obtaining practical knowledge and skills required by industrial applications in the complex field of information technologies.<br>The major specializations in Software Engineering are Information Technologies and Infocommunication Networks. The specialization Information Technologies deals with different aspects of the design and development of data driven applications, and with the model based and object oriented design and development principles.  While, the specialization Infocommunication Networks allow flexible and efficient information transfer and processing. Such networks form the base to implement a  huge variety of services in informatics, telecommunications and in distributed service provider systems.<br> Each specialization contains three courses focusing on the field of interest followed by a laboratory course and a project laboratory. In these laboratories equipped with up-to-date devices used in industry, students gain hands-on experiences which prepares them for industrial challenges.",
                        "tuitionFee": "3200",
                        "deadline": "01/12/2018",
                        "requirements": "- secondary school leaving certificate (quality min. 70%);<br>- electronic e-admission test result min. 50%<br>- language skills proven by TOEFL, IELTS or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3.5 years",
                        "degreeType": "BA",
                        "credits": "210",
                        "courseID": 2
                    },
                    {
                        "courseName": "Electrical Engineering",
                        "description": "The BSc Program in Electrical Engineering is designed to give students a thorough understanding of the tools, methods, applications and practice of Electrical Engineering. It is both focused and practical in its orientation, with the goal to provide an education that is directly applicable to positions in industry. It is an integrated curriculum consisting of courses developed for the deeper theoretical understanding of the foundations of electrical engineering as well as for obtaining practical knowledge and skills required by  industrial applications.<br>The major specializations in Electrical Engineering are Infocommunication, Power Engineering, and Embedded and Controller Systems. Infocommunication is concerned with telecommunication and computer network based applications (voice, data, image, video, multimedia and composite social information systems).  Power Engineering covers a wide range of theoretical and practical knowledge including the design and safe operation of electrical energy transmission and distribution systems, the design and operation of electric machines, and operational principles and applications of low and high voltage switching devices. Embedded and Controller Systems focuses on computer based and application oriented systems which operate autonomously and have intensive information exchange with their physical-technological environment. <br>Each specialization contains three courses focusing on the field of specialization followed by a laboratory course and a project laboratory. In these laboratories equipped with up-to-date devices, students gain hands-on experiences which prepares them for various industrial challenges.",
                        "tuitionFee": "3200",
                        "deadline": "01/12/2018",
                        "requirements": "- secondary school leaving certificate (quality min. 70%);<br>- electronic e-admission test result min. 50%<br>- language skills proven by TOEFL, IELTS or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3.5 years",
                        "degreeType": "BA",
                        "credits": "210",
                        "courseID": 3
                    },
                    {
                        "courseName": "Mathematics",
                        "description": "During the six-semester Mathematics BSc program students acquire skills in pure and applied mathematics which enable them to pursue successful Master's studies at inland or foreign leading universities or get employed in different areas of technology, economics, statistics and informatics. Profiting of the environment given by the University of Technology and Economics we train experts who are interested in practical problems and are able to use their knowledge creatively. In addition to being familiar with abstract fields of mathematics, they are able to communicate and collaborate with representatives of other professions. Through extensive relationships of our Institute our students can gain an insight into various fields of applications of mathematics and mathematical modelling of real life problems.<br>Students getting a BSc degree in Mathematics at our university can quickly and easily find a decent high-paying job either in Hungary or abroad. Several banks, investment funds, insurance, business consulting companies as well as those engaged in data mining or optimization employ mathematicians in senior positions. After receiving the BSc degree students can be admitted to the Applied Mathematics or Mathematics master program or other MSc programs subject to special conditions.<br>Special characteristics of our BSc program are the tutorial system, a large number of homework problems, opportunities to take part in project works and to get involved in high-level scientific research and a significantly higher than average personal attention paid to students thanks to their relatively small number.",
                        "tuitionFee": "3200",
                        "deadline": "01/12/2018",
                        "requirements": "- secondary school leaving certificate;<br>- language skills proven by TOEFL, IELTS or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "credits": "180",
                        "courseID": 4
                    },
                    {
                        "courseName": "Mechanical Engineering",
                        "description": "The undergraduate BSc program of the Faculty of Mechanical Engineering is designed to continue a tradition of excellence by providing well-grounded and broad knowledge that graduates of this Faculty can apply immediately in their work and also use as the basis for further studies, and graduating competent engineers who are not only masters of their profession, but also possess an ethical philosophy of engineering based on accuracy and reliability as well as a respect for the human element.",
                        "tuitionFee": "3200",
                        "deadline": "01/12/2018",
                        "requirements": "- secondary school leaving certificate;<br>- language skills proven by TOEFL, IELTS, Cambridge First Certificate or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3.5 years",
                        "degreeType": "BA",
                        "credits": "240",
                        "courseID": 5
                    },
                    {
                        "courseName": "Physics",
                        "description": "The BSc in Physics Program, a traditional curriculum, leads to a BSc degree in six semesters. The facilities and scientific-tutorial background of the Institute of Physics and the Institute of Nuclear Techniques offer unique opportunities in areas like low temperature physics, acousto-optics, holography, nuclear techniques or medical physics. A further advantage of our Physics BSc Program is the engineering background provided by the Budapest University of Technology and Economics. From the third semester specialised courses can be chosen from various fields of theoretical, experimental and applied physics.",
                        "tuitionFee": "3200",
                        "deadline": "01/12/2018",
                        "requirements": "- secondary school leaving certificate;<br>- language skills proven by TOEFL, IELTS or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3 years",
                        "degreeType": "BA",
                        "credits": "180",
                        "courseID": 6
                    },
                    {
                        "courseName": "Applied Mathematics",
                        "description": "The two-year MSc program in Applied Mathematics (math.bme.hu/masters/) provides a profound knowledge of applied mathematics which is competitive both in the academic and non-academic sectors. Possible specializations are Stochastics and Financial Mathematics. Students of our MSc program may enter leading-edge research projects of the Department of Stochastics  (a cutting edge research center in stochastics, the host of our MSc studies).<br>The most important features of our MSc programs are as follows: On the one hand, we put emphasis on building closer personal relationship between our students and the teaching staff of the Department via providing personal tutors to all of our MSc students. On the other hand, we do not only give a very profound knowledge in Stochastics but we also prepare all of the students for successful collaboration with those people from industry, finance or insurance sectors who apply mathematics in their work.<br>Some of the best students of our  MSc program continue their studies and become  Ph.D. students at either our university or some cutting-edge universities in the US or Europe. Others get well-paid jobs at leading banks, insurance, and consulting companies, like Morgan Stanley or in the industry.",
                        "tuitionFee": "3500",
                        "deadline": "01/12/2018",
                        "requirements": "- eligible BSc diploma;<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 7
                    },
                    {
                        "courseName": "Architecture (Five-year Integrated Master Program)",
                        "description": "The Faculty of Architecture at the Budapest University of Technology and Economics focuses on training highly professional experts in architectural engineering who are aware of the social and cultural implications of their profession. Versatility is emphasised so that students will gain fundamental knowledge and abilities in every possible field of architecture and be able to find work in a highly competitive job market, and in any building- or design-related area of consulting, construction, and management.",
                        "tuitionFee": "3500",
                        "deadline": "01/12/2018",
                        "requirements": "- secondary school leaving certificate;<br>- language skills proven by TOEFL, IELTS, Cambridge First Certificate or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "5 years",
                        "degreeType": "MA",
                        "credits": "300",
                        "courseID": 8
                    },
                    {
                        "courseName": "Chemical Engineering",
                        "description": "The Faculty of Chemical Technology and Biotechnology aims for its students to acquire a profound theoretical knowledge in mathematics, physics and physical chemistry. It also aims to have its students experience, during their studies, all the types of tasks that chemical engineers encounter in their practical everyday work. Students will acquire up-to-date laboratory skills, get acquainted with the machines and apparati used in the chemical industry, know the principles needed for their optimal operation, and develop expertise in a more specific technology within the chemical, food and light industries.",
                        "tuitionFee": "3500",
                        "deadline": "01/12/2018",
                        "requirements": "- diploma of BSc in corresponding fields (official translation needed);<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 9
                    },
                    {
                        "courseName": "Computer Engineer",
                        "description": "The MSc Program in Computer Engineering is designed to give students a thorough understanding of the tools, methods, applications and practice of computer science and information technologies. It is both focused and practical in its orientation, with the goal to provide an education that is directly applicable to positions in industry. It is an integrated curriculum consisting of courses developed for the deeper theoretical understanding of the foundations of computer science as well as for obtaining practical knowledge and skills required by industrial applications in the complex field of information technologies.<br>The major specializations in Computer Engineering are Applied Informatics and Internet Architectures. The specialization Applied Informatics deals with different aspects of the design and development of data driven applications, and with the model based and object oriented design and development principles.  While, the specialization Internet Architectures allows flexible and efficient information transfer and processing. Such networks form the base to implement a huge variety of services in informatics, telecommunication and in distributed service provider systems.<br>Each specialization contains three courses focusing on the field of interest followed by a laboratory course and a project laboratory. In these laboratories equipped with up-to-date devices used in industry, students gain hands-on experiences which prepares them for industrial challenges.",
                        "tuitionFee": "3500",
                        "deadline": "01/12/2018",
                        "requirements": "- diploma of BSc in corresponding fields  (min. quality 70%);<br>- electronic e-admission test result min. 50%<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 10
                    },
                    {
                        "courseName": "Electrical Engineering",
                        "description": "The MSc Program in Electrical Engineering is designed to give students a thorough understanding of the tools, methods, applications and practice of Electrical Engineering. It is both focused and practical in its orientation, with the goal to provide an education that is directly applicable to positions in industry. It is an integrated curriculum consisting of courses developed for the deeper theoretical understanding of the foundations of electrical engineering as well as for obtaining practical knowledge and skills required by  industrial applications.<br>The major specializations in Electrical Engineering are Multimedia Systems , Power Systems, and Embedded and Controller Systems.  The track Multimedia Systems is concerned with telecommunication and computer network based applications (voice, data, image, video, multimedia and composite social information systems).  Power Engineering covers a wide range of theoretical and practical knowledge including the design and safe operation of electrical energy transmission and distribution systems, the design and operation of electric machines, and operational principles and applications of low and high voltage switching devices. Embedded and Controller Systems focuses on computer based and application oriented systems which operate autonomously and have intensive information exchange with their physical-technological environment. <br>Each specialization contains three courses focusing on the field of specialization followed by a laboratory course and a project laboratory. In these laboratories equipped with up-to-date devices, students gain hands-on experiences which prepares them for various industrial challenges.",
                        "tuitionFee": "3500",
                        "deadline": "01/12/2018",
                        "requirements": "-diploma of BSc in corresponding fields  (min. quality 70%);<br>- electronic e-admission test result min. 50%<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 11
                    },
                    {
                        "courseName": "Environmental Engineering",
                        "description": "The aim of the education is to train engineers, suitable for activities in fields of planning, R&D and professional management in environment protection and environmental policy by their high level knowledge in science, technology, informatics and economics. Their general engineering qualification guarantees their participation in team-work.",
                        "tuitionFee": "3500",
                        "deadline": "01/12/2018",
                        "requirements": "- diploma of BSc in corresponding fields (official translation needed);<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 12
                    },
                    {
                        "courseName": "Mechanical Engineering Modelling",
                        "description": "The courses in the Mechanical Engineering Modeling MSc-program deal with those time-dependent problems of mechanical engineering, which typically require the efficient modeling of tasks in order to access the continuously developing methods of computational engineering. The tasks of mechanical engineers require the modeling of machines in motion and that of time-varying processes are based on solid and fluid mechanics, thermodynamics and electronics. Modeling means the understanding and active application of the related theories, which are supported by differential equations and numerical methods in mathematics. Modeling needs also experimental work during the research-development-innovation process. Modeling is also affected by the engineers knowledge in design, technology, and informatics, since the model should not be so complex that the available software is unable to solve them within reasonable time and for reasonable cost.",
                        "tuitionFee": "3500",
                        "deadline": "01/12/2018",
                        "requirements": "- diploma of BSc in Mechanical Engineering<br>- quality of BSc transcript min 70%<br>- language skills proven by TOEFL (min points iBT 90 or 550), Cambridge First Certificate, or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 13
                    },
                    {
                        "courseName": "Physics",
                        "description": "The four-semester MSc in Physics program provides comprehensive knowledge, built upon strong theoretical and experimental bases on a broad area of physics, supported by the facilities and scientific-tutorial background of the Institute of Physics and the Institute of Nuclear Techniques. Students can select various courses related to solid state physics, quantum physics and informatics, nanotechnology and materials science, optics and photonics, nuclear physics, as well as to medical physics.",
                        "tuitionFee": "3500",
                        "deadline": "01/12/2018",
                        "requirements": "- BSc diploma in Physics or any fields of engineering;<br>- min. 25 ECTS credits in Physics and 15 ECTS credits in Mathematics obtained<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 14
                    },
                    {
                        "courseName": "Structural Engineering",
                        "description": "The MSc course in structural engineering provides advanced knowledge of structural analysis using advanced computer techniques, including the theoretical background of the methods. This course might be useful not only for those who are interested in research and consider continuing doctoral studies, but for leading engineers of the future: practicing engineers facing special structural problems.",
                        "tuitionFee": "3800",
                        "deadline": "01/12/2018",
                        "requirements": "- diploma of BSc in Civil Engineering and curriculum in field of structural engineering<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "1.5 years",
                        "degreeType": "MA",
                        "credits": "132",
                        "courseID": 15
                    },
                    {
                        "courseName": "Transport Engineering",
                        "description": "The aim of the programme is to train transportation engineers, who will be able to organize and operate processes of passenger and goods transportation. They will learn how to choose proper measures for these tasks, how to operate and maintain such transportation systems, including elements of infrastructure, control and IT systems. The graduates will be able to analyze, plan, organize and control transport related processes in an integrated way considering economic, safety, environmental and human resource aspects. Graduates will be able to deal with tasks of transport administration and transport authorities, choice and operation of vehicles and facilities of passenger and good transportation systems and related infrastructural, control and IT system elements. The students will also be prepared to higher management tasks, to creatively participate in research & development tasks. These studies prepare students for our PHD programme.",
                        "tuitionFee": "3500",
                        "deadline": "01/12/2018",
                        "requirements": "- diploma of BSc in engineering fields<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 16
                    },
                    {
                        "courseName": "Vehicle Engineering",
                        "description": "The aim of the programme is to train vehicle engineers, who will be able to maintain and operate road, railway, water, air, construction and material handling vehicles with appropriate knowledge in the fields of transportation and logistics. They will be able to fulfill roles of vehicle engineering tasks, like improvement, manufacturing and operation. The listed tasks are accomplished by taking into account safety, environment and energy management aspects. Our aim is to provide the required knowledge to graduates, required to manage development, design, dimensioning, manufacturing and analyzing internal processes of different vehicles. The students will also be prepared to management tasks and to creatively participate in Research & Development related tasks. These studies prepare students for our PHD programmes.",
                        "tuitionFee": "3500",
                        "deadline": "01/12/2018",
                        "requirements": "- diploma of BSc in engineering fields<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 17
                    },
                    {
                        "courseName": "Architecture Engineering",
                        "description": "The Faculty of Architecture offers graduate studies in its two graduate schools. The program of the Doctoral School of Architecture leads to the PHD-equivalent degree Doctor of Liberal Arts (DLA). The four year long curriculum strongly focuses on creative architectural design supported by project-based research. Studies in Csonka Pál Graduate School cover a wide range of scientific and engineering topics related to architecture and building such as history of architecture or applied mechanics. The focus of this school is independent research under personal supervision.",
                        "tuitionFee": "4500",
                        "deadline": "01/12/2018",
                        "requirements": "- eligible diploma of MSc;<br>- research plan agreed by the host institute in advance;<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points), Cambridge First Certificate, or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 18
                    },
                    {
                        "courseName": "Chemistry",
                        "description": "The PHD training consits of two phases. In the first period (semester 1-4) the research and publication activity is augmented by studies of certain subjects. To enroll into the second phase a successful complex exam should be taken. The second phase is devoted to research activity and writing up of the thesis. It started on 1st September 2016.",
                        "tuitionFee": "4500",
                        "deadline": "01/12/2018",
                        "requirements": "- eligible diploma of MSc;<br>- research plan agreed by the host institute in advance;<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 19
                    },
                    {
                        "courseName": "Chemical- Bio- and Environmental Engineering",
                        "description": "The PHD training consits of two phases. In the first period (semester 1-4) the research and publication activity is augmented by studies of certain subjects. To enroll into the second phase a successful complex exam should be taken. The second phase is devoted to research activity and writing up of the thesis. It started on 1st September 2016.",
                        "tuitionFee": "4500",
                        "deadline": "01/12/2018",
                        "requirements": "- eligible diploma of MSc;<br>- research plan agreed by the host institute in advance;<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 20
                    },
                    {
                        "courseName": "Civil Engineering Sciences and Earth Sciences",
                        "description": "The doctoral school has two programmes in civil engineering sciences (Structural engineering and Infrastructure engineering)  and one programme in earth sciences (Geodesy and Geoinformatics engineering), as a cohererent continuation of the three respective master programmes of the Faculty. The Infrastructure engineering programme also covers the specialisation in hydraulic and water environmental engineering, whereas the Structural engineering programme also comprises structural mechanics connected to biomechanics.",
                        "tuitionFee": "4500",
                        "deadline": "01/12/2018",
                        "requirements": "- diploma of MSc in Civil Engineering;<br>- research plan agreed by the host institute in advance;<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 21
                    },
                    {
                        "courseName": "Computer Engineer",
                        "description": "The PHD Program in Computer Engineering is designed to pursue research in the areas of infocommunications, algorithms, data security , data bases, and SW technologies. There are courses which provide the disciplinary background of research including cutting edge mathematics in the domain of stochastic processes, functional analysis and linear algebra, and also in networking and algorithms. There are at least 20-30 research topics announced each year by the supervisors. Besides completing the courses the PHD students research on their chosen topics and publish their results with the help of their supervisors. ",
                        "tuitionFee": "4500",
                        "deadline": "01/12/2018",
                        "requirements": "- diploma of MSc in corresponding fields  (min. quality 70%);<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 22
                    },
                    {
                        "courseName": "Electrical Engineering",
                        "description": "The PHD Program in Electrical Engineering is designed to pursue research in the areas of embedded systems, robotics, control, telecommunication systems, microwave technologies, electron devices, nanotechnology, antennas and propagation, power systems and energetics. There are courses which provide the disciplinary background of research including cutting edge mathematics in the domain of stochastic processes, functional analysis and linear algebra, and also in networking and algorithms. There are at least 20-30 research topics announced each year by the supervisors. Besides completing the courses the PHD students research on their chosen topics and publish their results with the help of their supervisors.",
                        "tuitionFee": "4500",
                        "deadline": "01/12/2018",
                        "requirements": "- diploma of MSc in corresponding fields  (min. quality 70%);<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 23
                    },
                    {
                        "courseName": "Mathematics and Computer Science",
                        "description": "The Doctoral School of Mathematics and Computer Science offers a PHD training in all branches of Mathematics, Applied Mathematics, Computer Science and Information Theory. Our PHD students have the opportunity to participate in world-class mathematical research under the guidance of internationally renowned scientists. In recent years a significant portion of our PHD students won a post-doctoral research position in leading European and American universities. After graduation some of them are still teaching in leading European and American universities. The PHD program is 4 years long, with a complex midterm exam at the end of the second year. For further information on the program, morover the list of offered topics, see doktori.math.bme.hu/english/index-E.html",
                        "tuitionFee": "4500",
                        "deadline": "01/12/2018",
                        "requirements": "- MSc diploma in Natural Sciences, Engineering, Informatics or Economics;<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 24
                    },
                    {
                        "courseName": "Mechanical Engineering Science",
                        "description": "The  academic  staff  of  the  Faculty  are  doing  research  in  the  most  relevant  fields  of  the  mechanical enginereering  discipline,  and  related  applied  sciences.  PHD  candidates  are  welcome  to  take  part  in  this research work in order to prepare for the PHD procedure. PHD  at  the  Faculty  is  a  degree  that  can  be  earned  by  sufficiently  proving  the  candidate's  ability  for selfstanding  scientific  work  that  must  be  demonstrated  by  writing  a  thesis  summarising  the  candidate's research  results.  Furthermore,  it  is  necessary  to  pass  a  set  of  qualifying  examinations  in  some  basic  and applied sciences related to the field of the submitted thesis. Candidates are to publish their results prior to the submission of their theses.",
                        "tuitionFee": "4500",
                        "deadline": "01/12/2018",
                        "requirements": "- diploma of MSc in Mechanical Engineering<br>- min quality of MSc diploma: good<br>- language skills proven by TOEFL (min points iBT 90 or 550), Cambridge First Certificate, or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 25
                    },
                    {
                        "courseName": "Transportation Engineering",
                        "description": "The highest level of the faculty's education is represented by the Kandó Kálmán Doctoral School, where the PHD students are being prepared for scientific research and a possible career as a professor and researcher. The 4 year program lets the students take part in professional subjects and courses, teaching activities and individual scientific research tasks. The programme's tasks deal with transportation, vehicle industry and logistics related questions, which actual topics are frequently updated.",
                        "tuitionFee": "4500",
                        "deadline": "01/12/2018",
                        "requirements": "- diploma of MSc in engineering fields<br>- research plan agreed by the host institute in advance<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 26
                    },
                    {
                        "courseName": "Vehicle Engineering",
                        "description": "The highest level of the faculty's education is represented by the Kandó Kálmán Doctoral School, where the PHD students are being prepared for scientific research and a possible career as a professor and researcher. The 4 year program lets the students take part in professional subjects and courses, teaching activities and individual scientific research tasks. The programme's tasks deal with transportation, vehicle industry and logistics related questions, which actual topics are frequently updated.",
                        "tuitionFee": "4500",
                        "deadline": "01/12/2018",
                        "requirements": "- diploma of MSc in engineering fields<br>- research plan agreed by the host institute in advance<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 27
                    },
                    {
                        "courseName": "Logistic Engineering",
                        "description": "The highest level of the faculty's education is represented by the Kandó Kálmán Doctoral School, where the PHD students are being prepared for scientific research and a possible career as a professor and researcher. The 4 year program lets the students take part in professional subjects and courses, teaching activities and individual scientific research tasks. The programme's tasks deal with transportation, vehicle industry and logistics related questions, which actual topics are frequently updated.",
                        "tuitionFee": "4500",
                        "deadline": "01/12/2018",
                        "requirements": "- diploma of MSc in engineering fields<br>- research plan agreed by the host institute in advance<br>- language skills proven by TOEFL (min 500 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 28
                    },
                    {
                        "courseName": "Physical Sciences",
                        "description": "The post-graduate PHD in Physics Program is available in all domains offered in the Physics MSc Program, such as in solid state physics, quantum physics and informatics, nanotechnology and materials science, optics and photonics, nuclear physics, as well as in medical physics.",
                        "tuitionFee": "4500",
                        "deadline": "01/12/2018",
                        "requirements": "- diploma of MSc in Physics or any fields of engineering;<br>- language skills proven by TOEFL (min iBT 90 or PBT 550 points), IELTS (min 5.0 points) or equivalent certificates",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "4 years",
                        "degreeType": "PHD",
                        "credits": "No Available",
                        "courseID": 29
                    }
                ]
            },
            {
                id: "8",
                "universityname": "Moholy-Nagy University of Art and Design",
                "aboutUniversity": "Moholy-Nagy University of Art and Design Budapest (MOME) is one of the most significant European institutions of visual culture due to its traditions and intellectual background. In its effort to visualize its professional concepts MOME compounds its own character and traditions with the most up-to-date trends. Its educational structure comprises architecture, design, media, as well as theory. Therefore, MOME has a great international potential considering its broad field of education and synthesis of students. The three-cycle study structure (BA/MA/DLA) provides adequate flexibility and mobility for its students. MOME’s definite ambition is to further broaden its international relations. It welcomes every professional co-operation which inspires its educational and artistic work. MOME on the one hand is a university which educates professional designers, and on the other hand an intellectual workshop with the aim of setting up creative process in order to enhance design consciousness in Hungary.",
                "generalRequirement": "All degree applicants have to use a central national application system,  and pass the entrance exam in July. Please note that there is a certain application fee. The application period is approximately during February every year in general. After application, applicants should contact the university for further information about the specific MOME admission procedure.",
                "data-keyword": "",
                "country": "Hungary",
                "student_payment": false,
                "application_url": "http://mome.hu/en/course/bachelor-programmes",
                "email":"nemeth@mome.hu",
                "campusImgUrl": "",
                "universityProfilePic": "mome",
                "skypeID": "",
                "examinationPortal": "",
                "universityAddress": "",
                "universityLogo": "images/mome-logo.png",
                "visibility": "show",
                "courses": [{
                        "courseName": "Animation",
                        "description": "The aim of the Animation MA program is to educate individual animation artists and directors, as well as VFX experts and CGI artists, who make a significant contribution to various media projects and motion pictures.<br><br>Graduates of the training program are capable of developing animated contents, films, series, may act as creative producers of motion pictures, as well as communication and interactive applications using animation. Their skills, knowledge and experience obtained during the course make students competent in selecting and managing professionals (figure designers, animators, set designers, etc.) for diverse productions as well as in directing and managing creative pre-production and production-related processes.<br>During the four semesters of the MA program students develop animation projects through which they obtain indispensable filming and animating skills for designing and creating animated art objects.<br>MA students make a short film or any other animation project (transmedia project, games, interactive projects, etc.) as their diploma work: topic, content and form are all to be developed by the students on their own with the support of the teaching staff. The university manages the diploma films as its own productions, and takes over all tasks concerning the production and the nomination of diploma films for festivals, thus helping students in starting their career.<br><br>The work of MOME Anim reaches beyond the traditional frameworks of teaching. Talent management and content development set in an international network are of significant role, an important outcome is the creation and operation of incubator programs. The department has a strong network of active international relations, which gives students a wide range of opportunities to visit special training courses and international workshops in foreign partner institutions. Production activities are of key importance, in the framework of which animation project developments are commissioned by Hungarian and international partners, or realised in cooperation with them. The acquisition of research topics examining the contemporary issues related to animation film in regional, historical or other contexts is also part of the workshop’s life.",
                        "tuitionFee": "10000",
                        "deadline": "10/06/2018",
                        "requirements": "The following documents should be uploaded to the web hosting service of MOME. Information about the path and registration process of the service will be sent via e-mail in May/June to every applicant registered in the Hungarian Admission System. www.felvi.hu Please bring a copy of your application material for the interview on DVD or pendrive with you together with the confirmation of the payment of the application fee.<br><br>Upload period: 14 May 2018 – 10 June 2018<br><br>Formal criteria of application material:<br><br>When uploading, please create 4 different groups of information:<br><br>1. personal data file containing:<br><br>a. name<br>b. name by birth<br>c. mother's name by birth<br>d. photo of yourself (6x5cm)<br>e. CV<br>f. motivation letter<br>g. reference letter from previous university or workplace, if applicable<br>This file must be .pdf of A4 pages. Important: the file must not contain any data of availability (e.g. postal or email address, phone number)<br><br>2. data of previous studies file containing:<br><br>a. transcript of records<br>b. photocopy of diploma (if already obtained)<br>This file must be .pdf of scanned A4 pages in resolution 300dpi. Important: the file must not contain any data of availability (e.g. postal or email address, phone number)<br><br>3. certification of the payment file containing:<br><br>a. photocopy of certification of the payment of 4000 HUF for the University<br>This file must be .pdf of A4 pages with resolution of 300 dpi.<br><br>4. portfolio:The size of portfolio should be no bigger than 500MB.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 0
                    },
                    {
                        "courseName": "Photography",
                        "description": "Photography is a medium to react in the most sensitive way to the changes in the world surrounding us. It is still more like a hybrid creature which is dependent on market, social and cultural changes. It is impossible to represent the visual language of the 21st century exclusively in the knowledge of traditional photographic genres. The training programme aims to meet contemporary challenges by offering in-depth and complex visual, photo-theoretical, cultural historical and up-to-date medial skills and knowledge, preserving a critical approach to media applications. Beyond high quality training, it is our objective to develop an interactive training model and workshop to help students obtain interdisciplinary skills and fulfill their artistic amibitions. Our programme provides students with sufficient knowledge for a long-term artistic and research career, or even a teaching career in higher education institutions. Visual art graduates are capable of handling the various photographic genres and media surfaces not merely as an issue of imaging but they think in terms of communication and information structures. They are competent in building bridges above the different competences and managing artistic teams as participants in market, research or art projects. During their studies students have the opportunity to meet prominent national and international artists. Beyond all this, the aim of the training is to increase the reputation of Hungarian visual and photographic culture in Hungary and abroad. The MA programme also prepares students for doctoral level studies.",
                        "tuitionFee": "10000",
                        "deadline": "10/06/2018",
                        "requirements": "The following documents should be uploaded to the web hosting service of MOME. Information about the path and registration process of the service will be sent via e-mail in May/June to every applicant registered in the Hungarian Admission System. www.felvi.hu Please bring a copy of your application material for the interview on DVD or pendrive with you together with the confirmation of the payment of the application fee.<br><br>Upload period: 14 May 2018 – 10 June 2018<br><br>Formal criteria of application material:<br><br>When uploading, please create 4 different groups of information:<br><br>1. personal data file containing:<br><br>a. name<br>b. name by birth<br>c. mother's name by birth<br>d. photo of yourself (6x5cm)<br>e. CV<br>f. motivation letter<br>g. reference letter from previous university or workplace, if applicable<br>This file must be .pdf of A4 pages. Important: the file must not contain any data of availability (e.g. postal or email address, phone number)<br><br>2. data of previous studies file containing:<br><br>a. transcript of records<br>b. photocopy of diploma (if already obtained)<br>This file must be .pdf of scanned A4 pages in resolution 300dpi. Important: the file must not contain any data of availability (e.g. postal or email address, phone number)<br><br>3. certification of the payment file containing:<br><br>a. photocopy of certification of the payment of 4000 HUF for the University<br>This file must be .pdf of A4 pages with resolution of 300 dpi.<br><br>4. portfolio:The size of portfolio should be no bigger than 500MB.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 1
                    },
                    {
                        "courseName": "Product Design",
                        "description": "The programme aims at forming a professional approach to design and developing an intellectual – economically and socially conscious – attitude open to new ideas and critical thinking. The bachelor level training programme in Product Design provides students with basic professional practical skills and a theoretical background for designing an object or a service. The problem-oriented and research-based MA programme, however, offers training to meet the newest challenges of design and business in three specialisations: furniture design, product design and vehicle design. The MA programme in Product Design focuses on issues related to the economic, cultural and environmental aspects and interrelations of globalisation, the local and global questions of sustainability. Solutions are hiding in design research, in which it is the quality of approach, a more elevated and complex level of thinking that is fundamental and not the product or object itself. Thus, the objectives of the MA programme are design-ethical way of thinking, development of a local/global, social/cultural attitude along with the reinforcement of a sense of professional responsibility.",
                        "tuitionFee": "10000",
                        "deadline": "10/06/2018",
                        "requirements": "The following documents should be uploaded to the web hosting service of MOME. Information about the path and registration process of the service will be sent via e-mail in May/June to every applicant registered in the Hungarian Admission System. www.felvi.hu Please bring a copy of your application material for the interview on DVD or pendrive with you together with the confirmation of the payment of the application fee.<br><br>Upload period: 14 May 2018 – 10 June 2018<br><br>Formal criteria of application material:<br><br>When uploading, please create 4 different groups of information:<br><br>1. personal data file containing:<br><br>a. name<br>b. name by birth<br>c. mother's name by birth<br>d. photo of yourself (6x5cm)<br>e. CV<br>f. motivation letter<br>g. reference letter from previous university or workplace, if applicable<br>This file must be .pdf of A4 pages. Important: the file must not contain any data of availability (e.g. postal or email address, phone number)<br><br>2. data of previous studies file containing:<br><br>a. transcript of records<br>b. photocopy of diploma (if already obtained)<br>This file must be .pdf of scanned A4 pages in resolution 300dpi. Important: the file must not contain any data of availability (e.g. postal or email address, phone number)<br><br>3. certification of the payment file containing:<br><br>a. photocopy of certification of the payment of 4000 HUF for the University<br>This file must be .pdf of A4 pages with resolution of 300 dpi.<br><br>4. portfolio:The size of portfolio should be no bigger than 500MB.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 2
                    }
                ]
            },
            {
                id: "9",
                "universityname": "Corvinus University",
                "aboutUniversity": "The mission of the Corvinus University of Budapest is to maintain an international standard of creating and transmitting values in the form of teaching, research and consulting activities, all in the context of academic freedom. The University strives to operate in a legally and morally unquestionable way. Therefore, the University requires its citizens to comply with the law, respect human dignity unconditionally, protect the natural environment and cultural heritage actively, and eventually, combine high professional skills with responsible work. The Corvinus University of Budapest regards its teachers, students and researchers as the most important creators of value in the institution. The University pledges to promote their creative professional involvement in Hungarian and international scientific life in every possible way.<br><br>The common goal of ongoing research and innovative development projects at academic workshops is to improve the quality of human life. Research conducted in fields including knowledge-based economy, economic policy, environmental management, modernization of public administration, social justice, equal opportunities and equal treatment, food security, garden product quality, organic agriculture, urban planning, landscape protection, as well as the image and safety of public spaces all target the creation of better living conditions, an improved quality of life, and the development of social, economic and environmental conditions.<br><br>The joint research and innovation objectives of the Corvinus University of Budapest serve the creation of a more viable world. Each faculty contributes to the improvement of the quality of life with the research results of their respective disciplines.<br><br>The Corvinus University of Budapest seeks to strengthen its international presence by utilising all potential opportunities for cooperation in international education and research. It is a basic objective of the University to offer an increasing number of foreign language trainings and joint degree programmes. A further goal is to increase student and staff mobility and to take up a more active role in encouraging international research. The Corvinus University of Budapest intends to make the scientific community - both Hungarian and international - respect and appreciate the results achieved by our students and faculties.",
                "generalRequirement": "Please check the list of required application materials for the program to which you are applying to know which forms you need to submit.<br><br>Petition for the Acceptance of Degree - You must submit this form if the country where your diploma was issued is not part of the Lisbon Agreement.<br><br>University Certificate for Transfer Students not required for free-mover / non-degree / Erasmus+ students",
                "data-keyword": "",
                "country": "Hungary",
                "student_payment": false,
                "application_url": "http://portal.uni-corvinus.hu/index.php?id=48665",
                "email":"intoffice@uni-corvinus.hu",
                "campusImgUrl": "",
                "universityProfilePic": "corvinus",
                "skypeID": "",
                "examinationPortal": "",
                "universityAddress": "",
                "universityLogo": "images/corvinus-logo.png",
                "visibility": "show",
                "courses": [{
                        "courseName": "Business and Management ",
                        "description": "The program consists of the following blocks: foundation courses, general business courses, specialization business courses, elective courses. The teaching methodology focuses on a combination of lectures (to provide the necessary theoretical knowledge required) and seminars (where students can apply the theory in practice). Seminars include interactive discussions, small group work, student projects and presentations, case studies and other business problem related issues. In addition to business, economics and social science elective courses, students are also offered the possibility to study foreign languages. In the course of the program, students will achieve a 12 week internship in a company where they will have to opportunity to apply their knowledge in real life. The curriculum thus provides a sound theoretical basis for the students’ future career, as well as combining theoretical knowledge with hands-on practice. The program is taught entirely in English and the truly international student body provides graduating students with the additional advantage of having worked together with students of other countries and cultures for 6 academic semesters.",
                        "tuitionFee": "2900",
                        "deadline": "31/05/2018",
                        "requirements": "If you meet the entry requirements in Mathematics and English and are accepted to the program, the official Letter of Acceptance will be issued only after you have sent the apostilled (or diplomatically legalized) version of your secondary school diploma to the ISP Office in PDF format. For this reason, we suggest that you make arrangements for the apostille/diplomatic legalization as soon as you have been awarded the secondary school diploma as it may take time to get the apostille/diplomatic legalization.<br><br>If the country where your secondary school diploma originated is not a member of the Apostille Convention, your diploma must be diplomatically legalized by the foreign ministry of the country in which the document originated, and then by the Hungarian Consulate of your home country.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3.5 years",
                        "degreeType": "BA",
                        "credits": "210",
                        "courseID": 0
                    },
                    {
                        "courseName": "International Business ",
                        "description": "The degree programme in International Business serves to prepare you for professional careers in companies and institutions that operate internationally. It was was designed for those young candidates who wish to enter an international business career. The aim of the programme is to provide you with practical business knowledge and a range of skills that will equip you to design your international business career. The programme combines studies in the major functions of business, with an international perspective on commercial strategies and operations. The program also considers the social, cultural and political dimensions of global business. Well designed modules, a carefully selected teaching staff and a rigorous quality management system guarantee the high quality of the programme. After completing your studies you will be able to handle a wide variety of tasks and situations in an international, multicultural environment. As a graduate you will be equipped with the adequate knowledge and skills to continue your studies at the Master’s level.",
                        "tuitionFee": "2900",
                        "deadline": "31/05/2018",
                        "requirements": "If you meet the entry requirements in Mathematics and English and are accepted to the program, the official Letter of Acceptance will be issued only after you have sent the apostilled (or diplomatically legalized) version of your secondary school diploma to the ISP Office in PDF format. For this reason, we suggest that you make arrangements for the apostille/diplomatic legalization as soon as you have been awarded the secondary school diploma as it may take time to get the apostille/diplomatic legalization.<br><br>If the country where your secondary school diploma originated is not a member of the Apostille Convention, your diploma must be diplomatically legalized by the foreign ministry of the country in which the document originated, and then by the Hungarian Consulate of your home country.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "3.5 years",
                        "degreeType": "BA",
                        "credits": "210",
                        "courseID": 1
                    },
                    {
                        "courseName": "Marketing",
                        "description": "The MSc in Marketing program prepares students for real-world marketing challenges. Graduates from the program will understand how marketing creates value for a company or organization, will be able to draft effective marketing plans, and will master the functional processes of marketing. Participants receive comprehensive knowledge throughout the program.The program is offered on a Full time, two-year basis.",
                        "tuitionFee": "3300",
                        "deadline": "30/04/2018",
                        "requirements": "Foreign citizen applicants must apply according to the below requirements. The admission process occurs in two stages: application and interview. If your application is accepted, you will be contacted to take the entry exams.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 2
                    },
                    {
                        "courseName": "Business Information Technology ",
                        "description": "The MSc in Business Information Technology program prepares students for the challenges of the era of digital business transformation. The objective of the program is to provide such complementary skills - relying on the previously acquired IT and management knowledge - that enable students to manage efficiently information resources in organizations.<br><br>Based on solid theoretical knowledge both in IT and in business, the program covers all areas in which an IT managage can encounter information systems. The program integrates management, controlling and accounting with IT-related competencies: managing information as a strategic resource, information strategy planning, system design and development, IT project management, application integration, business intelligence, process management, IT security and IT service management and IT audit. Key enterprise applications, major e-business and e-government technologies, internationally accepted methodologies and standards, like ITIL, COBIT, etc. are also addressed.<br><br>.The program is offered on a Full time, two-year basis.",
                        "tuitionFee": "3300",
                        "deadline": "31/05/2018",
                        "requirements": "Foreign citizen applicants must apply according to the below requirements. The admission process occurs in two stages: application and interview. If your application is accepted, you will be contacted to take the entry exams.",
                        "language": "English",
                        "programType": "Full Time",
                        "courselength": "2 years",
                        "degreeType": "MA",
                        "credits": "120",
                        "courseID": 3
                    }
                ]
            },
            {
                id: "10",
                "universityname": "Budapest Business School",
                "aboutUniversity": "Budapest Business School (BBS), the largest university of applied sciences in Hungary educates nearly 16,000 students in the area of Tourism and Hospitality, International Business Economics, Commerce and Marketing, Finance and Accountancy, Business Administration and Management, Human Resources and Business Information Systems.<br><br>Our legal predecessor was formed in 2000 by the integration of three successful colleges and was awarded the Higher Education Quality Prize in 2010. In fact, our history dates back to the Academy of Commerce established in 1857.<br><br>Three of our faculties are based in Budapest: the Faculty of Commerce, Hospitality and Tourism, the Faculty of International Management and Business and the Faculty of Finance and Accountancy.<br><br>Our fourth faculty, the Faculty of Business Administration is based in Zalaegerszeg. Our education portfolio covers all areas of economic sciences, our uniqueness and market recognition is due to our experience-based and practive-focues training structure tuned to fit the needs and expectations in the market.<br><br>Our mission is to become one of the leading economic universities of applied sciences in the Central European region, with this focus we continuously strive to offer our students knowledge that is useful in practice and is an expection of the employment market in order to enable them to become professionals who are well prepared, ethical, socially responsible and who have wide perspective, innovative skills, a solid knowledge of their particular field and including foreign languages.",
                "generalRequirement": "",
                "data-keyword": "",
                "country": "Hungary",
                "student_payment": false,
                "application_url": "https://en.uni-bge.hu/documents/1.Application-forms-of-degree-progammes-in-foreign-languages",
                "email":"admission@bgf.hu",
                "campusImgUrl": "",
                "universityProfilePic": "bgf",
                "skypeID": "",
                "examinationPortal": "",
                "universityAddress": "",
                "universityLogo": "images/bgf-logo.png",
                "visibility": "show",
                "courses": [{
                    "courseName": "International Business Economics",
                    "description": "During the seven semesters of the course, students will acquire a good working knowledge in two foreign languages. Students will also gain a detailed insight into a specific professional field. The main aims of the programme are to train students to be able to operate successfully and achieve the results required of them in an increasingly challenging European business environment, and also to familiarise them with the micro- and macro-economic processes and the various levels of business decision-making.  Over the course of the programme students will deepen their theoretical and practical knowledge, and learn to apply their knowledge in practice. Considerable attention will be devoted to developing analytical, problem-solving and communication skills. In parallel with its teaching theory, this programme of study will emphasise practice-oriented learning. As a result, graduates will acquire relevant, up-to-date professional and practical knowledge.<br><br>Amongst the units of the curriculum, top priority has been given by the partner institutions to topics focusing on the European Union, world economics and international trade policy. A special group of subjects deal with the market and with the creation, operation and development of the various market forces and pertinent institutions. The principles and practice of exporting also feature in the curriculum.<br><br>The foundation units, together with subjects like Statistics, Business Planning, Information Technology and Operations Research will develop problem-solving skills and provide a solid basis on which to build the acquisition of further knowledge in the areas of the world economy, the world of enterprises, marketing and management.<br><br>In the fifth and sixth semesters students will have the chance to specialise in areas that they are most interested in. The specialisations currently running are: International Business Enterprises, Economic Diplomacy, and International Business Communication. International Business Enterprises can be taken in English, while the language of tuition in the two other specialisations is Hungarian.<br><br>BBS have been internationalizing its campus through organising double degree programmes in close cooperation with selected partner universities. The English Language Programme of BBS FIMB coordinated the programme’s curricula with its partner schools with the aim of allowing students to graduate with two diplomas in 7 semesters. Whilst designing the curriculum, the primary aim of the partner institutions was to satisfy the requirement whereby the various units in the curriculum link up to each other - both in content and structure - so as to enable students either to pursue further studies in Hungarian or foreign (European Union) institutions of higher education specialising in economics or business, or to go on to study for a specialised degree.",
                    "tuitionFee": "2000",
                    "deadline": "01/12/2018",
                    "requirements": "Foreign nationals<br>wishing to be admitted to the study programme should address <br>their application to the Admissions Board. Applications should be submitted by completing <br>and sending in the application form: <br>en.bgf.hu/cimb/cimb_content/HOWTOAPPLY<br>For further information please contact the English Language Programme Office at Budapest <br>Business School<br>University of Applied Sciences<br>College of International Management and <br>Business.",
                    "language": "English",
                    "programType": "Full Time",
                    "courselength": "3.5 years",
                    "degreeType": "BA",
                    "credits": "No Available",
                    "courseID": 0
                }]
            },
            {
                id: "11",
                "universityname": "MODUL University Vienna ",
                "aboutUniversity": "MODUL University Vienna (MU) is an internationally-oriented organization for research and education on tourism, sustainable development, new media technology, and public governance. It was established by the Vienna Economic Chamber of Commerce and approved by the Austrian Accreditation Council in 2007. MU combines a strong academic foundation with a commitment to sustainability and innovation as the key drivers of long-term success. It aims to foster independent and original research and bring the benefits of innovation to the research community and the general public. MU builds upon an international network of partner universities, commercial enterprises and public institutions. Its faculty comprises renowned Austrian and international scholars who have a strong commitment to develop this young organization into a leading research platform in its fields.",
                "data-keyword": "",
                "country": "Austria",
                "student_payment": false,
                "application_url": "https://applynow.modul.ac.at/applicant/register",
                "email":"admissions@modul.ac.at",
                "campusImgUrl": "",
                "universityProfilePic": "",
                "skypeID": "",
                "examinationPortal": "",
                "universityAddress": "",
                "universityLogo": "images/modul-vienna-logo.png",
                "visibility": "show",
                "courses": [
                    {
                    "courseName": "Bachelors in Event Management",
                    "description": "The focus of the major in Event Management is to equip students with the necessary skills and knowledge to design, deliver and assess dynamic events, differing in scope and across a range of purposes. Building on the fundamentals of business administration and management covered in the common body of knowledge, students develop their capacity to think creatively and critically to design, develop and stage innovative and successful events. The courses are designed to cover the entire events cycle: From the inception of an idea or concept to the operationalization thereof, including professional project management, the staging phase of an event and the post-event assessment and critical impact analysis. Principles of sustainable event management are paramount in our approach to the topic and are intertwined with professional acumen across the specialization.",
                    "tuitionFee": "6166",
                    "deadline": "15-03",
                    "requirements": "High school / secondary education (or higher)<br>The entry qualification documents are accepted in the following languages: English / German.<br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original. Fill in all required fields and be prepared to upload the following documents:<br>Curriculum vitae (personal data sheet)<br>Letter of motivation (description of reasons for applying to MODUL University Vienna)<br>Academic qualification to enter the study program (high school certificate including transcripts!)<br>Proof of English proficiency level B2<br>Copy of passport<br>Passport-sized photograph<br>One letter of recommendation (from academic sources)<br>Please make sure that your application is complete! Incomplete applications will not be considered! ",
                    "courselanguage": "English",
                    "language": "IELTS band score 5.5 (no sub-score below 5.0)<br>TOEFL Internet Based Test: 65 points<br>Other equivalent English proficiency tests will be assessed on an individual basis.",
                    "programType": "Full Time",
                    "courselength": "3 years (6 semesters)",
                    "degreeType": "BA",
                    "credits": "180",
                    "courseID": 0
                },
                {
                    "courseName": "Bachelor in Tourism and Hospitality Management",
                    "description": "Internationally, the hotel and catering industry is known as being highly dynamic and largely resilient to economic waves. This sector has been a reliable provider of unlimited career opportunities, with ever growing expectations regarding the knowledge and skills required of the workforce in middle and upper management positions. Despite the phenomenal growth the hotel and catering industry has experienced in the last decade, the current challenges are evident: Traditional business models are questioned and hoteliers are pressured to keep up with developments in technology. Customers are informed about prices, products and competition better than ever before and thus become more demanding. Additionally, institutional investors have entered the playing field, asserting pressures on owners to generate an acceptable return on investment. The hospitality industry has long been perceived simply as a peoples’ industry with a main focus on effective service delivery. Without question, the social aspects of the hotel industry are still prevailing, yet the managerial challenges of this profession have gained in complexity.",
                    "tuitionFee": "6166",
                    "deadline": "15-03",
                    "requirements": "High school / secondary education (or higher)<br>The entry qualification documents are accepted in the following languages: English / German.<br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original. Fill in all required fields and be prepared to upload the following documents:<br>Curriculum vitae (personal data sheet)<br>Letter of motivation (description of reasons for applying to MODUL University Vienna)<br>Academic qualification to enter the study program (high school certificate including transcripts!)<br>Proof of English proficiency level B2<br>Copy of passport<br>Passport-sized photograph<br>One letter of recommendation (from academic sources)<br>Please make sure that your application is complete! Incomplete applications will not be considered! ",
                    "courselanguage": "English",
                    "language": "IELTS band score 5.5 (no sub-score below 5.0)<br>TOEFL Internet Based Test: 65 points<br>Other equivalent English proficiency tests will be assessed on an individual basis.",
                    "programType": "Full Time",
                    "courselength": "3 years (6 semesters)",
                    "degreeType": "BA",
                    "credits": "180",
                    "courseID": 1
                },
                {
                    "courseName": "Bachelor of Business Administration in Tourism, Hotel Management and Operations",
                    "description": "The Bachelor of Business Administration in Tourism, Hotel Management and Operations is particularly tailored towards those students with no prior professional experience in the hotel or tourism industry. In two additional semesters (60 ECTS), students gain fundamental knowledge about the micro and macro structure of the industry. The management of food and beverage organizations are studied both in theory and in practice. Courses in Culinary Theory and Practice, Restaurant and Service Management as well as Rooms Division Management provide students with necessary professional skills and expertise to successfully engage in professional practice. This Bachelor program is completed with a set of specialization subjects from the field of hotel management, in which students are exposed to advanced hotel management issues ranging from hotel property planning to performance management and devising strategic business opportunities.",
                    "tuitionFee": "6500",
                    "deadline": "15-03",
                    "requirements": "High school / secondary education (or higher)<br>The entry qualification documents are accepted in the following languages: English / German.<br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original. Fill in all required fields and be prepared to upload the following documents:<br>Curriculum vitae (personal data sheet)<br>Letter of motivation (description of reasons for applying to MODUL University Vienna)<br>Academic qualification to enter the study program (high school certificate including transcripts!)<br>Proof of English proficiency level B2<br>Copy of passport<br>Passport-sized photograph<br>One letter of recommendation (from academic sources)<br>Please make sure that your application is complete! Incomplete applications will not be considered! ",
                    "courselanguage": "English",
                    "language": "IELTS band score 5.5 (no sub-score below 5.0)<br>TOEFL Internet Based Test: 65 points<br>Other equivalent English proficiency tests will be assessed on an individual basis.",
                    "programType": "Full Time",
                    "courselength": "4 years (8 semesters)",
                    "degreeType": "BA",
                    "credits": "240",
                    "courseID": 2
                },
                {
                    "courseName": "Bachelor in Tourism and Hospitality Management ",
                    "description": "The importance of the tourism industry is indisputable when it comes to employment and overall contribution to the global economy. Yet, at the same time, destinations nowadays are faced with many challenges that their managers must be able to deal with if they are to ensure long-term viability. Managers must have a clear understanding of the strengths and weaknesses of a destination to enhance competitiveness and create a basis for effective promotion and overall growth.",
                    "tuitionFee": "6166",
                    "deadline": "15-03",
                    "requirements": "High school / secondary education (or higher)<br>The entry qualification documents are accepted in the following languages: English / German.<br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original. Fill in all required fields and be prepared to upload the following documents:<br>Curriculum vitae (personal data sheet)<br>Letter of motivation (description of reasons for applying to MODUL University Vienna)<br>Academic qualification to enter the study program (high school certificate including transcripts!)<br>Proof of English proficiency level B2<br>Copy of passport<br>Passport-sized photograph<br>One letter of recommendation (from academic sources)<br>Please make sure that your application is complete! Incomplete applications will not be considered! ",
                    "courselanguage": "English",
                    "language": "IELTS band score 5.5 (no sub-score below 5.0)<br>TOEFL Internet Based Test: 65 points<br>Other equivalent English proficiency tests will be assessed on an individual basis.",
                    "programType": "Full Time",
                    "courselength": "3 years (6 semesters)",
                    "degreeType": "BA",
                    "credits": "180",
                    "courseID": 3
                },
                {
                    "courseName": "Bachelor of Science in International Management",
                    "description": "The challenges of conducting business in an international environment are manifold and the Bachelor of Science in International Management is designed to provide the necessary breadth of business and management acumen for graduates to face complex problems in a variety of business contexts. Culture, language, political systems, geography and socio-economic factors all influence business practice. The rapid advances in technology has led to economies without borders, and they continue to have profound effects on business operations. New business models emerge, the role of customers in co-creating products, services and experiences increases, the emergence of the sharing economy has experts question the sustainability of a growth paradigm which is based on consumption. The business leaders, forward thinkers and managers of tomorrow need to be able to continuously question current practice, and be able to creatively and innovatively react to changes in the international business environment.",
                    "tuitionFee": "6166",
                    "deadline": "15-03",
                    "requirements": "High school / secondary education (or higher)<br>The entry qualification documents are accepted in the following languages: English / German.<br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original. Fill in all required fields and be prepared to upload the following documents:<br>Curriculum vitae (personal data sheet)<br>Letter of motivation (description of reasons for applying to MODUL University Vienna)<br>Academic qualification to enter the study program (high school certificate including transcripts!)<br>Proof of English proficiency level B2<br>Copy of passport<br>Passport-sized photograph<br>One letter of recommendation (from academic sources)<br>Please make sure that your application is complete! Incomplete applications will not be considered! ",
                    "courselanguage": "English",
                    "language": "IELTS band score 5.5 (no sub-score below 5.0)<br>TOEFL Internet Based Test: 65 points<br>Other equivalent English proficiency tests will be assessed on an individual basis.",
                    "programType": "Full Time",
                    "courselength": "3 years (6 semesters)",
                    "degreeType": "BA",
                    "credits": "180",
                    "courseID": 4
                },
                {
                    "courseName": "Bachelor of Science in Entrepreneurship and Governance",
                    "description": "Entrepreneurial activities take place within a wider institutional environment, in which a range of public, private and societal institutions progressively shape the economy and society. Successful managers and entrepreneurs of tomorrow need to be able to identify those institutional environments that best facilitate innovation and encourage market competitiveness. In addition, managers should recognize opportunities to influence and collaborate with public, economic, and corporate governance institutions to benefit their own entrepreneurial activities.",
                    "tuitionFee": "6166",
                    "deadline": "15-03",
                    "requirements": "High school / secondary education (or higher)<br>The entry qualification documents are accepted in the following languages: English / German.<br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original. Fill in all required fields and be prepared to upload the following documents:<br>Curriculum vitae (personal data sheet)<br>Letter of motivation (description of reasons for applying to MODUL University Vienna)<br>Academic qualification to enter the study program (high school certificate including transcripts!)<br>Proof of English proficiency level B2<br>Copy of passport<br>Passport-sized photograph<br>One letter of recommendation (from academic sources)<br>Please make sure that your application is complete! Incomplete applications will not be considered! ",
                    "courselanguage": "English",
                    "language": "IELTS band score 5.5 (no sub-score below 5.0)<br>TOEFL Internet Based Test: 65 points<br>Other equivalent English proficiency tests will be assessed on an individual basis.",
                    "programType": "Full Time",
                    "courselength": "3 years (6 semesters)",
                    "degreeType": "BA",
                    "credits": "180",
                    "courseID": 5
                },
                {
                    "courseName": "Bachelor of Interactive Marketing",
                    "description": "The challenges of conducting business in an international environment are manifold and the Bachelor of Science in International Management is designed to provide the necessary breadth of business and management acumen for graduates to face complex problems in a variety of business contexts. Culture, language, political systems, geography and socio-economic factors all influence business practice. The rapid advances in technology has led to economies without borders, and they continue to have profound effects on business operations. New business models emerge, the role of customers in co-creating products, services and experiences increases, the emergence of the sharing economy has experts question the sustainability of a growth paradigm which is based on consumption. The business leaders, forward thinkers and managers of tomorrow need to be able to continuously question current practice, and be able to creatively and innovatively react to changes in the international business environment.",
                    "tuitionFee": "6166",
                    "deadline": "15-03",
                    "requirements": "High school / secondary education (or higher)<br>The entry qualification documents are accepted in the following languages: English / German.<br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original. Fill in all required fields and be prepared to upload the following documents:<br>Curriculum vitae (personal data sheet)<br>Letter of motivation (description of reasons for applying to MODUL University Vienna)<br>Academic qualification to enter the study program (high school certificate including transcripts!)<br>Proof of English proficiency level B2<br>Copy of passport<br>Passport-sized photograph<br>One letter of recommendation (from academic sources)<br>Please make sure that your application is complete! Incomplete applications will not be considered! ",
                    "courselanguage": "English",
                    "language": "IELTS band score 5.5 (no sub-score below 5.0)<br>TOEFL Internet Based Test: 65 points<br>Other equivalent English proficiency tests will be assessed on an individual basis.",
                    "programType": "Full Time",
                    "courselength": "3 years (6 semesters)",
                    "degreeType": "BA",
                    "credits": "180",
                    "courseID": 6
                },
                {
                    "courseName": "Master in Management",
                    "description": "Focus on your personal growth. The program’s curriculum integrates ethics, business intelligence, sustainability, and personal development alongside general management coursework. This combination provides MSc graduates with the vision and personal growth needed for success in a world facing global competition and constant change.",
                    "tuitionFee": "6000",
                    "deadline": "15-03",
                    "requirements": "The entry qualification documents are accepted in the following languages: English / German.<br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original. Fill in all required fields and be prepared to upload the following documents:<br>Curriculum vitae (personal data sheet)<br>Letter of motivation (description of reasons for applying to MODUL University Vienna)<br>Academic qualification to enter the study program (university degree including transcripts!)<br>Proof of English proficiency level B2<br>Copy of passport<br>Passport-sized photograph<br>Two letter of recommendation (from academic sources)<br>Please make sure that your application is complete! Incomplete applications will not be considered!<br>If not available yet, university diploma and/or English test result may be submitted later on. In such cases, the most up-to-date transcripts must be submitted and provisional admission may be granted until the pending document is submitted.",
                    "courselanguage": "English",
                    "language": "IELTS band score 5.5 (no sub-score below 5.0)<br>TOEFL Internet Based Test: 65 points<br>Other equivalent English proficiency tests will be assessed on an individual basis.",
                    "programType": "Full Time",
                    "courselength": "2 years (4 semesters)",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 7
                },
                {
                    "courseName": "Master in International Tourism Management",
                    "description": "Be ready for the global tourism industry. The Master of Science (MSc) in International Tourism Management (ITM) graduate program prepares students to best address the future needs of the global tourism industry. The program focuses on leadership and management, specifically with regards to hospitality-related companies, tourism marketing, tourism planning organizations, and policy makers.",
                    "tuitionFee": "6000",
                    "deadline": "15-03",
                    "requirements": "The entry qualification documents are accepted in the following languages: English / German.<br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original. Fill in all required fields and be prepared to upload the following documents:<br>Curriculum vitae (personal data sheet)<br>Letter of motivation (description of reasons for applying to MODUL University Vienna)<br>Academic qualification to enter the study program (university degree including transcripts!)<br>Proof of English proficiency level B2<br>Copy of passport<br>Passport-sized photograph<br>Two letter of recommendation (from academic sources)<br>Please make sure that your application is complete! Incomplete applications will not be considered!<br>If not available yet, university diploma and/or English test result may be submitted later on. In such cases, the most up-to-date transcripts must be submitted and provisional admission may be granted until the pending document is submitted.",
                    "courselanguage": "English",
                    "language": "IELTS band score 5.5 (no sub-score below 5.0)<br>TOEFL Internet Based Test: 65 points<br>Other equivalent English proficiency tests will be assessed on an individual basis.",
                    "programType": "Full Time",
                    "courselength": "2 years (4 semesters)",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 8
                },
                {
                    "courseName": "Master in Sustainable Development, Management, and Policy",
                    "description": "Be an influencer for future global challenges. Guided by expert faculty, students come to understand that effective implementation of sustainability strategies is a fundamental societal, economic, and environmental need. MU's prioritization of sustainability as an integral part of the university offers unique opportunities for students to gain hands-on learning experience.",
                    "tuitionFee": "6000",
                    "deadline": "15-03",
                    "requirements": "The entry qualification documents are accepted in the following languages: English / German.<br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original. Fill in all required fields and be prepared to upload the following documents:<br>Curriculum vitae (personal data sheet)<br>Letter of motivation (description of reasons for applying to MODUL University Vienna)<br>Academic qualification to enter the study program (university degree including transcripts!)<br>Proof of English proficiency level B2<br>Copy of passport<br>Passport-sized photograph<br>Two letter of recommendation (from academic sources)<br>Please make sure that your application is complete! Incomplete applications will not be considered!<br>If not available yet, university diploma and/or English test result may be submitted later on. In such cases, the most up-to-date transcripts must be submitted and provisional admission may be granted until the pending document is submitted.",
                    "courselanguage": "English",
                    "language": "IELTS band score 5.5 (no sub-score below 5.0)<br>TOEFL Internet Based Test: 65 points<br>Other equivalent English proficiency tests will be assessed on an individual basis.",
                    "programType": "Full Time",
                    "courselength": "2 years (4 semesters)",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 9
                },
                {
                    "courseName": "Specialization in Digital Marketing and Social Media",
                    "description": "With the rise of smartphones, video games, tablets, social networks and other forms of devices and new media organizations are changing the way they communicate with customers and market their products and services. The Digital Marketing and Social Media specialization is designed to give you the knowledge and skills to successfully navigate in this ever-changing digital world.",
                    "tuitionFee": "6000",
                    "deadline": "15-03",
                    "requirements": "The entry qualification documents are accepted in the following languages: English / German.<br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original. Fill in all required fields and be prepared to upload the following documents:<br>Curriculum vitae (personal data sheet)<br>Letter of motivation (description of reasons for applying to MODUL University Vienna)<br>Academic qualification to enter the study program (university degree including transcripts!)<br>Proof of English proficiency level B2<br>Copy of passport<br>Passport-sized photograph<br>Two letter of recommendation (from academic sources)<br>Please make sure that your application is complete! Incomplete applications will not be considered!<br>If not available yet, university diploma and/or English test result may be submitted later on. In such cases, the most up-to-date transcripts must be submitted and provisional admission may be granted until the pending document is submitted.",
                    "courselanguage": "English",
                    "language": "IELTS band score 5.5 (no sub-score below 5.0)<br>TOEFL Internet Based Test: 65 points<br>Other equivalent English proficiency tests will be assessed on an individual basis.",
                    "programType": "Full Time",
                    "courselength": "2 years (4 semesters)",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 10
                },
                {
                    "courseName": "Specialization in Entrepreneurship, Innovation and Leadership",
                    "description": "The specialization in Entrepreneurship, Innovation and Leadership prepares you for the challenges of establishing and growing a business in today’s dynamic climate. Learn the skills and techniques behind entrepreneurial thought and action, and expertise which enable managers and entrepreneurs to make crucial decisions and compete successfully.",
                    "tuitionFee": "6000",
                    "deadline": "15-03",
                    "requirements": "The entry qualification documents are accepted in the following languages: English / German.<br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original. Fill in all required fields and be prepared to upload the following documents:<br>Curriculum vitae (personal data sheet)<br>Letter of motivation (description of reasons for applying to MODUL University Vienna)<br>Academic qualification to enter the study program (university degree including transcripts!)<br>Proof of English proficiency level B2<br>Copy of passport<br>Passport-sized photograph<br>Two letter of recommendation (from academic sources)<br>Please make sure that your application is complete! Incomplete applications will not be considered!<br>If not available yet, university diploma and/or English test result may be submitted later on. In such cases, the most up-to-date transcripts must be submitted and provisional admission may be granted until the pending document is submitted.",
                    "courselanguage": "English",
                    "language": "IELTS band score 5.5 (no sub-score below 5.0)<br>TOEFL Internet Based Test: 65 points<br>Other equivalent English proficiency tests will be assessed on an individual basis.",
                    "programType": "Full Time",
                    "courselength": "2 years (4 semesters)",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 11
                },
                {
                    "courseName": "Specialization in Innovation and Experience Design for Tourism",
                    "description": "This specialization offers students the opportunity to gain some further insights into how to create exceptional tourist experiences. Destinations offer similar products to increasingly demanding tourists. Therefore, it has become increasingly important to understand tourists’ needs and design exceptional experiences to maintain competitive and continuously innovate. Hotels, Restaurants, Sights and places of interest compete to attract clients. Experience Engineering and design can help such organizations to maintain a competitive edge and are at the core of successful innovation management of tourists in destinations.",
                    "tuitionFee": "6000",
                    "deadline": "15-03",
                    "requirements": "The entry qualification documents are accepted in the following languages: English / German.<br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original. Fill in all required fields and be prepared to upload the following documents:<br>Curriculum vitae (personal data sheet)<br>Letter of motivation (description of reasons for applying to MODUL University Vienna)<br>Academic qualification to enter the study program (university degree including transcripts!)<br>Proof of English proficiency level B2<br>Copy of passport<br>Passport-sized photograph<br>Two letter of recommendation (from academic sources)<br>Please make sure that your application is complete! Incomplete applications will not be considered!<br>If not available yet, university diploma and/or English test result may be submitted later on. In such cases, the most up-to-date transcripts must be submitted and provisional admission may be granted until the pending document is submitted.",
                    "courselanguage": "English",
                    "language": "IELTS band score 5.5 (no sub-score below 5.0)<br>TOEFL Internet Based Test: 65 points<br>Other equivalent English proficiency tests will be assessed on an individual basis.",
                    "programType": "Full Time",
                    "courselength": "2 years (4 semesters)",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 12
                },
                {
                    "courseName": "Specialization in Sustainable Management and Governance",
                    "description": "This specialization equips you with the knowledge and skills to succeed as responsible business leaders in all sectors. If you have a passion for creating more environmentally friendly and sustainable business models, this is the specialization for you. Forward-looking firms, public authorities, civil society and international institutions need to develop creative market-based solutions to alleviate environmental challenges, social injustice and poverty, in an ecosystemic approach.",
                    "tuitionFee": "6000",
                    "deadline": "15-03",
                    "requirements": "The entry qualification documents are accepted in the following languages: English / German.<br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original. Fill in all required fields and be prepared to upload the following documents:<br>Curriculum vitae (personal data sheet)<br>Letter of motivation (description of reasons for applying to MODUL University Vienna)<br>Academic qualification to enter the study program (university degree including transcripts!)<br>Proof of English proficiency level B2<br>Copy of passport<br>Passport-sized photograph<br>Two letter of recommendation (from academic sources)<br>Please make sure that your application is complete! Incomplete applications will not be considered!<br>If not available yet, university diploma and/or English test result may be submitted later on. In such cases, the most up-to-date transcripts must be submitted and provisional admission may be granted until the pending document is submitted.",
                    "courselanguage": "English",
                    "language": "IELTS band score 5.5 (no sub-score below 5.0)<br>TOEFL Internet Based Test: 65 points<br>Other equivalent English proficiency tests will be assessed on an individual basis.",
                    "programType": "Full Time",
                    "courselength": "2 years (4 semesters)",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 13
                },
                {
                    "courseName": "Specialization in Tourism and Services Management",
                    "description": "For those looking to focus their learning towards Tourism Services Management, this specialization provides you with in-depth subject knowledge of the services sectors, a cutting edge research environment, and up to date professional applications. The tourism industry is one of the fastest growing industries, where committed individuals who can develop and lead service operations are in high demand. This specialization opens doors for you if you want to work as a manager, analyst, consultant or researcher in the event, tourism, travel, transport and hotel industries.",
                    "tuitionFee": "6000",
                    "deadline": "15-03",
                    "requirements": "The entry qualification documents are accepted in the following languages: English / German.<br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original. Fill in all required fields and be prepared to upload the following documents:<br>Curriculum vitae (personal data sheet)<br>Letter of motivation (description of reasons for applying to MODUL University Vienna)<br>Academic qualification to enter the study program (university degree including transcripts!)<br>Proof of English proficiency level B2<br>Copy of passport<br>Passport-sized photograph<br>Two letter of recommendation (from academic sources)<br>Please make sure that your application is complete! Incomplete applications will not be considered!<br>If not available yet, university diploma and/or English test result may be submitted later on. In such cases, the most up-to-date transcripts must be submitted and provisional admission may be granted until the pending document is submitted.",
                    "courselanguage": "English",
                    "language": "IELTS band score 5.5 (no sub-score below 5.0)<br>TOEFL Internet Based Test: 65 points<br>Other equivalent English proficiency tests will be assessed on an individual basis.",
                    "programType": "Full Time",
                    "courselength": "2 years (4 semesters)",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 14
                },
                {
                    "courseName": "Doctor of Philosophy (PhD) in Business and Socioeconomic Sciences",
                    "description": "Doctor of Philosophy (PhD) in Business and Socioeconomic Sciences is a four year, Full time doctoral studies program that prepares candidates for making innovative research contributions in industry-related areas of specialization. The PhD in Business and Socioeconomic Sciences curriculum prepares qualified candidates in state-of-the-art approaches to conducting scholarly and applied research. The program emphasizes a multidisciplinary approach to finding solutions to research problems, drawing upon advanced concepts and methods from business management, economics, policy studies, sociology, and philosophy of science. Required foundation courses are taught in theory, methods, and research design.",
                    "tuitionFee": "2750 ",
                    "deadline": "15-03",
                    "requirements": "Fill in all required fields and be prepared to upload the following documents:<br>Curriculum Vitae<br>Statement of Research and Career Interest<br>Copies of certificates and degrees<br>Transcripts<br>Official copy of results of an English proficiency test or other proof for non-native speakers, i.e. proof of English proficiency level C2 according to the Common European Framework of Reference for Languages; 100 internet-based test; IELTS band score 7.0 (no sub-score under 6.0); or Cambridge Certificate (Certificate of Advanced English). Please note: The Admissions Committee may decide upon the recognition of other evidence of language skills.<br>One example of a research publication or report (optional)<br>Copy of passport<br>Photo<br>Two letters of recommendation",
                    "courselanguage": "English",
                    "language": "IELTS band score 5.5 (no sub-score below 5.0)<br>TOEFL Internet Based Test: 65 points<br>Other equivalent English proficiency tests will be assessed on an individual basis.",
                    "programType": "Full Time",
                    "courselength": "4 years (minimum)",
                    "degreeType": "PHD",
                    "credits": "240",
                    "courseID": 15
                }
            ],
                "scholarships": [
                {
                        "scholarshipID": "1",
                        "scholarshipName": "Vienna Chamber of Commerce Scholarship",
                        "description": "Amount: Bachelor: €9,000 for three year program, €14,000 for four year program</br>Master of Science: €8,000 (Please note: Cannot be combined with the MSc Merit Grant)</br>MBA: €7,000</br>Eligibility: All applicants who have a high chance to successfully integrate in the Austrian labor market upon graduation, i.e. Austrian citizenship holders or Non-Austrians who have lived in Austria for at least 3 years.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship <br> See scholarship description for further information on eligibility and special application requirements."

                    },
                    {
                        "scholarshipID": "2",
                        "scholarshipName": "Tourismusschulen MODUL Graduate Reduction",
                        "description": "Amount: Bachelor: €4,000 </br>Eligibility: All Tourismusschulen MODUL graduates (High school and ICHM) who apply to one of our Bachelor study programs.This reduction cannot be combined with the Tourism and Business School Graduate Reduction",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship <br> See scholarship description for further information on eligibility and special application requirements."

                    },
                    {
                        "scholarshipID": "3",
                        "scholarshipName": "Tourismusschulen & Business School Graduate Reduction (HLW, HBLA, HAK)",
                        "description": "Amount: Bachelor: €2,500</br>Eligibility: All applicants who graduated from a high school with a specialization in tourism or business, and who apply to one of our Bachelor study programs.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship <br> See scholarship description for further information on eligibility and special application requirements."

                    },
                    {
                        "scholarshipID": "4",
                        "scholarshipName": "MSc Merit Grant",
                        "description": "Amount: Bachelor: €5,000</br>Eligibility: All applicants for a Master of Science study program with a 80% and above Bachelor study performance are eligible to receive a reduction of €5,000 to their tuition fees.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship <br> See scholarship description for further information on eligibility and special application requirements."

                    },
                    {
                        "scholarshipID": "5",
                        "scholarshipName": "Reduction for Siblings",
                        "description": "Amount: 20% off the total tuition fees</br>Eligibility: a) sibling of current student applies to MU Vienna b) siblings apply for the same study intake (reduction is only given once).This reduction is not related to a study program and can be combined with other reductions.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship <br> See scholarship description for further information on eligibility and special application requirements."

                    },
                    {
                        "scholarshipID": "6",
                        "scholarshipName": "Next Generation Scholarship for PhD candidates",
                        "description": "PhD candidates who submit a research proposal regarding one of the following topics may also apply for a scholarship:</br>Sustainable Tourism and Sustainability of Tourism</br>Social Entrepreneurship and Investment</br>Technology-based Observation and Forecasting of Economic and Societal Trends</br>Sustainable Consumer Behavior</br>Sustainable Management and Leadership</br>Sustainable Governance, Social Sustainability and the Well-being of Societies</br>Digital consumers and Service Innovation</br>Successful applicants will be granted a substantial reduction or even a scholarship up to 50% of the tuition fees of €45,000",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship <br> See scholarship description for further information on eligibility and special application requirements."

                    },
                    {
                        "scholarshipID": "7",
                        "scholarshipName": "Merit Scholarships",
                        "description": "MODUL University grants also Merit Scholarships funded by the Ministry of Science, Research and Economics to currently enrolled students in all programs on the basis of academic excellence and extracurricular involvement. According to Austrian StudFG, there are two types of Merit Scholarships: Leistungsstipendium and Förderstipendium, whereby the Förderstipendium is foreseen for financing expenses that may arise for finishing a thesis that is expected to be of excellent quality. These expenses particularly include those for: accommodation, travel, conference/workshop participation, literature, and printing.</br>Eligibility:Applications for the Merit Scholarships can be submitted within the application period from December 1st until December 15th.</br>To be considered, students must fulfill criteria in three areas. Students are eligible if</br>For BBA and BSc applicants, they have completed a minimum of 60 ECTS (spring intake students: 54 ECTS) during the previous academic year (the strict ECTS requirement may be relaxed for those students who are close to finishing their studies and only have a few courses left to take and/or for those students who were on study exchange during the previous academic year),</br>For MSc and PhD applicants, they have completed all required courses in their curriculum that were offered by the University during the previous academic year,</br>For MBA applicants, they have completed 69 ECTS (part-time students: 34 ECTS) (including transfer credits) during the previous academic year.</br>AND</br>if they have a weighted average grade of 90% or higher based on the grades of their mandatory courses taken at MODUL University (excluding internships) during the previous two semesters. *</br>AND</br>if they prove that they have taken part in extracurricular or community activities during their studies at MU, such as additional work experience, committee work, serving as a student representative, community/volunteer involvement, participation in on-campus and off-campus university activities and or other such contributions.</br>The federal ministry restricts these merit scholarships to only those students holding an EU passport. Students can apply for either a Leistungsstipendium or a Förderstipendium, but not for both at the same time.</br>Amount and number of grants</br>The number of grants per stage and their amount will depend on the amount of money available per academic year. The available amount of money for each stage and academic year will be fixed together with the university budget for the forthcoming academic year and will be allocated to all awarded students depending on their individual performance.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship <br> See scholarship description for further information on eligibility and special application requirements."

                    },
                    {
                        "scholarshipID": "8",
                        "scholarshipName": "MSc Scholarship for Dean's List Award Recipients",
                        "description": "Students who have been named to the Dean’s List twice during their MU undergraduate career will receive a scholarship for MU’s MSc program and only pay €11,000 tuition for the entire program (excl. Early Bird Reduction).  (*The alumni grant or other MU scholarships cannot be used in conjunction with the Dean’s List MSc Scholarship.)</br>Dean's List award requirements:</br>Students must earn a minimum of 24 ECTS or more during a semester at MODUL University. Students need a GPA of 90% or above and cannot have earned a final grade below 80% in the respective semester. Only courses at MODUL University qualify in the GPA calculation.  Only first attempts will be counted (if a student fails a course the first time and then retakes it, it will not be taken into account).",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship <br> See scholarship description for further information on eligibility and special application requirements."

                    },
                    {
                        "scholarshipID": "9",
                        "scholarshipName": "MODUL University Alumni Grant",
                        "description": "Amount:<br>Applicants for a Master of Science program: €2,000<br>Applicants for the MBA program: €4,000<br>Eligibility: All applicants who graduated from a Bachelor study program at MODUL University Vienna.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship <br> See scholarship description for further information on eligibility and special application requirements."

                    },
                    {
                        "scholarshipID": "10",
                        "scholarshipName": "MSc High Potential Grant",
                        "description": "Amount: €1,000<br>Eligibility: 3 yr. BBA & BSc: 130 ECTS + 80% overall average grade or above; 4 yr. BBA: 180 ECTS + 80% overall average grade or above",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship <br> See scholarship description for further information on eligibility and special application requirements."

                    },
                    {
                        "scholarshipID": "11",
                        "scholarshipName": "Graduate Assistantship",
                        "description": "Each year the Dean of the Graduate School of MODUL University Vienna may select up to four outstanding applicants to receive a graduate assistantship work study opportunity. All graduate applicants applying for the fall intake each year will be considered for a Graduate Assistantship unless otherwise stated in the application documents. The criteria for being awarded a Graduate Assistantship include academic excellence in previous studies and a strong background in conducting empirical research. The work-study scholarship is up to € 8,000 for the entire study program (24 months). In return for a total payment of €6,000 over a period of four semesters, the student is obliged to support MODUL University Vienna in various administrative tasks, supporting for different departments. The amount of work hours is approximately 300 per academic year, i.e. 600 hours in total. Upon satisfactory completion of the four semesters of services for MODUL University Vienna, a scholarship amount of €2,000 will be reimbursed to the student.<br>Graduate Assistants are required to register for at least six hours of credit each semester and are prohibited from working elsewhere in addition to the assistantship.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship <br> See scholarship description for further information on eligibility and special application requirements."

                    },
                    {
                        "scholarshipID": "12",
                        "scholarshipName": "Undergraduate Valedictorian Award",
                        "description": "Amount: €24,000<br>Eligibility: MU Vienna Bachelor graduate applying for a MSc program at MU Vienna.<br>Overview: This scholarship is awarded to one student who has the highest academic record of all graduating students (from all Bachelor study programs) in a particular academic year.",
                        "tuitionFee": "",
                        "degreeType": "scholarship",
                        "deadline": "",
                        "requirements": "You need to apply to the university first, using the app and the university can provide additional information on the scholarship and will determine if you are eligiible for the scholarship <br> See scholarship description for further information on eligibility and special application requirements."

                    }
                ]
            },
            {
                id: "12",
                "universityname": "Carinthia University of Applied Sciences",
                "aboutUniversity": "Since its foundation in 1995, CUAS has made history. Back then we started with 2 programs and about 70 students; currently we offer 30 study programs that educate almost 2000 full- and part-time students. About the same number of CUAS graduates is impressive proof of the necessity and importance of this academic institution. Through ever growing acceptance of the programs as well as the high demand for our graduates in industry, the programs will be further developed in the coming years.CUAS has developed into a unique educational institution in Carinthia. Through constant further development of the degree programs at CUAS and intensive cooperation with the worlds of business and science, those studying at the university can be certain of a progressive education with its finger on the pulse of time. CUAS lives the vision of direct practical experience. Full- and part-time lecturers, as well as guest speakers from industry and business ensure an interdisciplinary, internationally oriented education. Degree programs are offered in the fields of civil engineering and architecture, engineering, as well as management, healthcare and social issues.",
                "generalRequirement": "Degree programs at University of Applied Sciences fundamentally only offer a limited number of study places.In the framework of the application process each applicant will carry out an interview which will influence the allocation of the study places. <br><br> Additionally, specific degree study programs may require written application tests as well as content-specific/technical aptitude tests. Detailed information regarding the degree program specific application requirements are provided on the degree programs’ web pages.Repetitive applications for a study place at the same study degree program (e.g., in the following year) is generally allowed; however, the entire application process will start anew and candidates must resubmit all documents and carry out all steps again.",
                "data-keyword": "CUAS",
                "country": "Austria",
                "student_payment": false,
                "application_url": "https://bewerbung.cuas.at/en/#tx-srfeuserregister-pi1-email",
                "email":"",
                "campusImgUrl": "",
                "universityProfilePic": "",
                "skypeID": "",
                "examinationPortal": "",
                "universityAddress": "",
                "universityLogo": "images/carithia-logo.png",
                "visibility": "show",
                "courses": [
                    {
                    "courseName": "Msc in Systems Design, Master of Engineering",
                    "description": "Systems Design is a new Master Degree program in engineering focusing on the design and implementation of complex systems. Systems Design graduates are able to understand, develop, and modify complex technical systems in the fields of electronics and mechatronics.<br><br>Course Information</br>Students acquire detailed knowledge of mathematics, informatics, technological physics, control systems, numeric processes, circuit design, robotics and systems theory.<br><br>These qualifications allow graduates to take up leading positions in research and development in a variety of fields.",
                    "tuitionFee": "363,36",
                    "deadline": "15-03",
                    "requirements": "In order to be admitted into a master degree program at the Carinthia University of Applied Sciences at least one of the following criteria must be fulfilled:<br>Completion of a bachelor of arts/science degree that corresponds to the respective master degree program<br>Completion of an equivalent degree program at a recognized Austrian or an international <br>Post-secondary institution of higher education <br> Persons in their last semester of their bachelor degree programs may apply for a study place in a master degree program by submitting their most current transcript of records.  The completion of the bachelor degree program certificates must be submitted during the registration process at the beginning of the semester.",
                    "courselanguage": "English",
                    "language": "No English Test Specified",
                    "programType": "Full Time",
                    "courselength": "4 Semesters",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 0
                },
                {
                    "courseName": "Msc in Integrated Systems and Circuits Design",
                    "description": "For about five decades, integrated circuits (IC, microchips) have now been the key technologies for electronic systems in many application areas, ranging from data processing to telecommunication and automobile electronics. In this domain, an unprecedented development has taken place from the assembly of the first planar ICs with two transistors in the year 1961 to today’s integrated processor components with up to a billion transistors on a single chip. An ending of this development is not yet foreseeable and Very Deep Submicron (VDSM) fabrication technologies (with structure sizes that are smaller than 100 nm) will offer the possibility to integrate even more complex systems.",
                    "tuitionFee": "363,36",
                    "deadline": "15-03",
                    "requirements": "In order to be admitted into a master degree program at the Carinthia University of Applied Sciences at least one of the following criteria must be fulfilled:<br>Completion of a bachelor of arts/science degree that corresponds to the respective master degree program<br>Completion of an equivalent degree program at a recognized Austrian or an international <br>Post-secondary institution of higher education <br> Persons in their last semester of their bachelor degree programs may apply for a study place in a master degree program by submitting their most current transcript of records.  The completion of the bachelor degree program certificates must be submitted during the registration process at the beginning of the semester.",
                    "courselanguage": "English",
                    "language": "No English Test Specified",
                    "programType": "Full Time",
                    "courselength": "4 Semesters",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 1
                },
                {
                    "courseName": "Msc in Communication Engineering",
                    "description": "Modern communication technology can be characterized as an integral part of our information society in our everyday lives.  These technologies determine the speed of innovation and developmental key points in a variety of societal, economic and technical areas.  The Master of Science degree program Communication Engineering stands for digital transformation.  The academic program has been designed to prepare our graduates for the dynamic and ever-changing digital world in order for them to successfully play a part in it.  This hands-on, practical degree program enables our students to oversee the multitude of data streams in technical networks and to plan and administer modern communication systems.",
                    "tuitionFee": "363,36",
                    "deadline": "15-03",
                    "requirements": "In order to be admitted into a master degree program at the Carinthia University of Applied Sciences at least one of the following criteria must be fulfilled:<br>Completion of a bachelor of arts/science degree that corresponds to the respective master degree program<br>Completion of an equivalent degree program at a recognized Austrian or an international <br>Post-secondary institution of higher education <br> Persons in their last semester of their bachelor degree programs may apply for a study place in a master degree program by submitting their most current transcript of records.  The completion of the bachelor degree program certificates must be submitted during the registration process at the beginning of the semester.",
                    "courselanguage": "English",
                    "language": "No English Test Specified",
                    "programType": "Full Time and Part Time",
                    "courselength": "4 Semesters",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 2
                },
                {
                    "courseName": "Msc in Electrical Energy & Mobility Systems",
                    "description": "Electrical Energy & Mobility Systems is a new Master degree program in engineering focusing on research, design and implementation of modern electrical energy, e-mobility, battery technology and electrical drive systems.<br>Electrical Energy & Mobility Systems graduates are able to understand, develop and modify complex technical systems in the fields of electric power train development, drive control, electrical machines, mobile power electronics, battery technology, power electronics, alternative energy systems and mobility concepts.",
                    "tuitionFee": "363,36",
                    "deadline": "15-03",
                    "requirements": "In order to be admitted into a master degree program at the Carinthia University of Applied Sciences at least one of the following criteria must be fulfilled:<br>Completion of a bachelor of arts/science degree that corresponds to the respective master degree program<br>Completion of an equivalent degree program at a recognized Austrian or an international <br>Post-secondary institution of higher education <br> Persons in their last semester of their bachelor degree programs may apply for a study place in a master degree program by submitting their most current transcript of records.  The completion of the bachelor degree program certificates must be submitted during the registration process at the beginning of the semester.",
                    "courselanguage": "English",
                    "language": "No English Test Specified",
                    "programType": "Full Time",
                    "courselength": "4 Semesters",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 3
                },
                {
                    "courseName": "Msc in Health Care IT",
                    "description": "The Master degree study program ‘Health Care IT’ was developed with the vision and goal to meet the information technology as well as the organizational development requirements and challenges in the healthcare sector.  Our students will learn to deal with these challenges through a thorough practice-oriented university education.<br>The core competence of the degree study program is the deepening of the fundamental understanding of the technical and organizational requirements within the information and communication technologies in the healthcare sector. Successful careers for our graduates are practically guaranteed through the acquired skill sets which can be put to use in solving the current requirements necessary in the fields of medical informatics, medical engineering and healthcare economics as well as future technical challenges.",
                    "tuitionFee": "363,36",
                    "deadline": "15-03",
                    "requirements": "In order to be admitted into a master degree program at the Carinthia University of Applied Sciences at least one of the following criteria must be fulfilled:<br>Completion of a bachelor of arts/science degree that corresponds to the respective master degree program<br>Completion of an equivalent degree program at a recognized Austrian or an international <br>Post-secondary institution of higher education <br> Persons in their last semester of their bachelor degree programs may apply for a study place in a master degree program by submitting their most current transcript of records.  The completion of the bachelor degree program certificates must be submitted during the registration process at the beginning of the semester.",
                    "courselanguage": "English",
                    "language": "No English Test Specified",
                    "programType": "Full Time",
                    "courselength": "4 Semesters",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 4
                },
                {
                    "courseName": "Bachelors in Intercultural Management",
                    "description": "Intercultural Management offers students a business degree in English with a specialization in Language and Intercultural Communication. The program is aimed at individuals interested in working in an international business environment. Students deepen their knowledge and understanding of culture and either the German or Italian language and can choose from our elective foreign language program.",
                    "tuitionFee": "363,36",
                    "deadline": "15-03",
                    "requirements": "In order to be admitted into a bachelor degree program at the Carinthia University of Applied Sciences at least one of the following criteria must be fulfilled: <br>Secondary School Leaving Certificate (Austrian ‘Matura’ or an equivalent international certificate) <br>- Higher education (University) entrance examination certification <br>- Vocational higher education (University) entrance examination <br>- Vocational (VET) diploma examination (vocational apprenticeship or completion of at least a 3-year  <br> -vocational secondary school) with additional exams <br> Moreover, there are degree program specific additional prerequisites as well as more comprehensive information regarding admissions on the individual web pages of the corresponding degree program.  The German University of Applied Sciences (Fachhochschule) entrance qualification certificate is only valid as as an admission prerequisite for an Austrian UAS/FH bachelor degree program when combined with an applicable vocational certificate. <br> Persons in their last year of school may apply for a study place in a bachelor degree program before taking their secondary school-leaving exams by submitting their most current secondary school grade/marks report.  The secondary school-leaving certificate must be submitted during the registration process at the beginning of the semester.",
                    "courselanguage": "English",
                    "language": "All applicants require sufficient English language skills (B2) to follow the program in English.",
                    "programType": "Full Time",
                    "courselength": "6 Semesters",
                    "degreeType": "BA",
                    "credits": "180",
                    "courseID": 5
                },
                {
                    "courseName": "MA in International Business Management",
                    "description": "International Business Management is highly practice-oriented. Problem-based learning, real-life case studies, online simulations, consulting projects for international companies, team challenges or excursions provide opportunities to learn about international business in an interactive way.",
                    "tuitionFee": "363,36",
                    "deadline": "15-03",
                    "requirements": "In order to be admitted into a master degree program at the Carinthia University of Applied Sciences at least one of the following criteria must be fulfilled:<br>Completion of a bachelor of arts/science degree that corresponds to the respective master degree program<br>Completion of an equivalent degree program at a recognized Austrian or an international <br>Post-secondary institution of higher education <br> Persons in their last semester of their bachelor degree programs may apply for a study place in a master degree program by submitting their most current transcript of records.  The completion of the bachelor degree program certificates must be submitted during the registration process at the beginning of the semester.",
                    "courselanguage": "English",
                    "language": "No English Test Specified",
                    "programType": "Full Time",
                    "courselength": "4 Semesters",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 6
                }]
            },
            {
                id: "13",
                "universityname": "Anhalt University of Applied Sciences",
                "aboutUniversity": "Anhalt University’s clear approach is convincing because it consistently brings together science and innovation. In Bernburg, Dessau, and Köthen, we provide innovative research and teaching at an international level. In addition, we offer a high quality of life and studies for nearly 8,000 students, 2,000 of whom contribute to the University’s international flair. The Bachelor’s and Master’s programs in seven departments have one thing in common - besides teaching expert knowledge, they prepare students for a successful start to their career.<br>Each subject at Anhalt University was developed for the practice, and education is carried out at a high level. Project work from the practice and practical final theses are standard. Student ideas are tested directly in terms of their practical applicability. New forms of teaching and e-learning, small study groups, outstanding research, and first-class contacts offer ideal conditions for a good start to a career in Germany or abroad.<br>Welcome to the heart of central Germany - the world opens up to you from here.",
                "generalRequirement": "",
                "data-keyword": "",
                "country": "Germany",
                "student_payment": false,
                "application_url": "https://ww2.uni-assist.de/online/Frontend/Registrierung/index?lang=en",
                "email":"",
                "campusImgUrl": "",
                "universityProfilePic": "",
                "skypeID": "",
                "examinationPortal": "",
                "universityAddress": "",
                "universityLogo": "images/Hochschule-Anhalt-logo.png",
                "visibility": "show",
                "courses": [
                    {
                    "courseName": "Master in Architectural and Cultural Heritage",
                    "description": "Working as an expert in the restoration sector is a new sector in architecture worldwide. In another sense there has always been the need for preservation, conservation and rehabilitation of heritage sites. The reason is very clear and simple; to preserve the history for the next generation. We feel the need for this more and more every day.<br>The Master's Program 'Architectural and Cultural Heritage' is the formal teaching approach to this. We are expecting to develop knowledge and also to share experiences of current practices in the sector of building restoration. Our program is a combination of theory, design and research.",
                    "tuitionFee": "none",
                    "deadline": "15-03",
                    "requirements": "Bachelor’s degree (not less than six semesters) in a related field is compulsory<br>Portfolio demonstrating the applicant’s interest in Monumental Heritage concerns.",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.) except for applicants from English-speaking countries <br> The course is taught in English. We require proof of you English language skill. This can be proved by submitting recognized certificates (for example IELTS, TOEFL etc.), if we have doubt about the quality of language skill, we will ask to seat for specific English language exam here in Germany",
                    "programType": "Full Time",
                    "courselength": "4 Semesters",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 0
                },
                {
                    "courseName": "Masters in Biomedical engineering",
                    "description": "Biomedical engineering supports biologists and medical professionals with technical solutions. These systems are complex, as are the subject areas: Systems Analysis, Modelling and Simulation, Medical Instrumentation, Biosensor Development, Signal Processing, Image processing, Rehabilitation Technology and Prosthetics, Medical Assistance Systems, Clinical Engineering and Biotechnology. Good conditions for crisis-proof jobs: a solid knowledge of the fundamentals in Medicine, Engineering and Medical Technology, more specifically in Anatomy and Physiology, Mechanics, Electronics, Computer and Programming Technology. Graduates ‘interpret’ between medical professionals and technicians and they are familiar with key regulations and laws. A unique pool of research equipment, close links to partners in the USA and excellent company contacts offer the ideal opportunities for development, both professionally and scientifically.",
                    "tuitionFee": "none",
                    "deadline": "15-03",
                    "requirements": "Academic degree in engineering or excellent grades in science or medicine",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.) except for applicants from English-speaking countries.This can be proved by submitting recognized certificates (for example IELTS, TOEFL etc.), if we have doubt about the quality of language skill, we will ask to seat for specific English language exam here in Germany.",
                    "programType": "Full Time",
                    "courselength": "4 Semesters",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 1
                },
                {
                    "courseName": "Masters in Membrane Structures (distance learning)",
                    "description": "The Master and Archineer® program is a career-integrated, distance learning program held in English language only. It was established to create a reliable standard of education in the field of textile building. The aim the program is to educate architects and engineers to design, build, erect, calculate, and maintain wide span lightweight structures. The Master and Archineer® program started in 2006 for the first time and has become very successful. More than 300 students from all over the world have already completed the program. Each summer semester, a new master’s program in Membrane Structures begins. The program consists of three study terms each containing of phases of attendance and additional support via internet for the distance-learning phases. The fourth semester is dedicated to the master’s thesis. During the phases of attendance, basics and skills will be taught as a foundation for the phases of distance learning afterwards. The entire study is characterized by a strict practical orientation enforced by the members of the lecturers, who are international specialists working in the field of textile building.",
                    "tuitionFee": "7900",
                    "deadline": "15-03",
                    "requirements": "Bachelor’s or master’s degree in Architecture, Civil Engineering and Surveying, or comparable academic programs with a minimum number of 8 semesters (240 ECTS). At least one year of professional work experience. Prospective students with a non-academic background also can apply for the program. They can participate as guest students of the Anhalt University. After successful completion of the program the non-academic title “Archineer® Membrane Structures” is granted. The application process for the Archineer® program is the same as that for the master’s program students.",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.) except for applicants from English-speaking countries.This can be proved by submitting recognized certificates (for example IELTS, TOEFL etc.), if we have doubt about the quality of language skill, we will ask to seat for specific English language exam here in Germany.",
                    "programType": "Distance Learning",
                    "courselength": "Career-Integrated Program",
                    "degreeType": "MA",
                    "credits": "60",
                    "courseID": 2
                },
                {
                    "courseName": "Masters in Photovoltaics Engineering Science",
                    "description": "Photovoltaics Engineering Science is a 3 semesters Master program in English language, which requires a Bachelor degree in engineering science or physics. No professional experience is needed. It consists of 2 semesters courses in solar cell physics, technology of crystalline silicon and thin-film solar cells and modules, cell and materials characterization, components of a PV system and their reliability, system design, monitoring, yield and performance analysis, storage systems and electric grids and solar energy integration. The technical subjects will be accompanied by courses in German language (usually at beginner level) and business administration. A final research semester under supervision of a professor from the University concludes the program. The courses combine lectures with exercises, seminars or practical laboratory work. The tuition in compact form will build up on a requested solid basis of knowledge in mathematics, physics, fundamentals of engineering and scientific methodology, which the applicant is expected to have acquired in a previous Bachelor program.  The research for the master thesis can be performed in the PV laboratory of Anhalt University, at the Fraunhofer Center for Silicon Photovoltaics CSP (in nearby city of Halle), or in any other PV laboratory or any PV company worldwide.",
                    "tuitionFee": "none",
                    "deadline": "15-03",
                    "requirements": "Application prerequisite is a Bachelor´s degree of at least 7 semesters (equivalent to 210 credit points) in engineering science or physics.An adequate coverage of mathematics, physics, chemistry or materials science, basics of electrical engineering, electronics and semiconductor materials and technology is necessary.  ",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.) except for applicants from English-speaking countries.This can be proved by submitting recognized certificates (for example IELTS, TOEFL etc.), if we have doubt about the quality of language skill, we will ask to seat for specific English language exam here in Germany.",
                    "programType": "Full time",
                    "courselength": "3 Semesters",
                    "degreeType": "MA",
                    "credits": "Not available",
                    "courseID": 3
                },
                {
                    "courseName": "Masters in Architecture (DIA)",
                    "description": "The study program Architecture (DIA) is located right next to the world-famous Bauhaus Dessau. It is influenced by its vivid history and driven by innovation. It complements the bachelor’s program in Architecture by systematically deepening the topics of architecture and urban planning. This then complete architecture education fulfills all formal regulations needed to apply for membership of the architectural association. The focus is on strengthening the knowledge in design expertise and methodology. Another focus is on the analysis of current questions related to culture and social sciences as well as to the humanities. Also the latest insights into research and development, new procedures, technologies and materials are highlighted.",
                    "tuitionFee": "850",
                    "deadline": "15-03",
                    "requirements": "Degree in Architecture",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.) except for applicants from English-speaking countries.This can be proved by submitting recognized certificates (for example IELTS, TOEFL etc.), if we have doubt about the quality of language skill, we will ask to seat for specific English language exam here in Germany.",
                    "programType": "Full time",
                    "courselength": "3 Semesters",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 4
                },
                {
                    "courseName": "Masters in Food Science, Technology and Business",
                    "description": "The two-year European Master of Science in Food Science, Technology and Business is jointly organized by three European partner institutions: KU Leuven, Anhalt University of Applied Sciences and Catholic University of Portugal. It fosters innovation and technology to help you cope with future needs and sustainability.",
                    "tuitionFee": "3000",
                    "deadline": "15-03",
                    "requirements": "Academic Bachelor of Science degree [BSc] with excellent grades in relevant subjects (chemistry, biological sciences, food science and technology, engineering, or a related subject area)ECTS grade 'grade C'<br>Equivalent qualification<br> Start: winter semester at KU Leuven (Belgium)<br> Partial study at Anhalt University of Applied Science [HSA]: summer semester<br> Students of HSA with a first university degree can also participate",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.) except for applicants from English-speaking countries.This can be proved by submitting recognized certificates (for example IELTS, TOEFL etc.), if we have doubt about the quality of language skill, we will ask to seat for specific English language exam here in Germany.",
                    "programType": "Full time",
                    "courselength": "4 Semesters",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 5
                },
                {
                    "courseName": "Masters in Design Research",
                    "description": "The core of the MSc. program, communicated using different teaching methods with the participation of the three aforementioned partner institutions, relies on three thematic building blocks: Design as research – analysis of the synthesizing practices; design as projection – anticipation and intervention strategies; design in the world – impact and application. The participants gain sound scientific knowledge and competences on the basis of tasks that are both practice-oriented and forward-looking. The successfully completed MSc. program qualifies graduates to study for a doctorate. Moreover, the program fosters personal growth and as such paves the way for a meaningful level of social engagement. The MSc. program COOP Design Research opens up professional perspectives in the fields of research and teaching, design and cultural studies, and curatorial practice.",
                    "tuitionFee": "none",
                    "deadline": "15-03",
                    "requirements": "Completed university degree in a bachelor’s or master's degree program in Architecture or Design, Cultural Studies, or related degree programs, with a standard period of study of at least 4 years comprising 240 ECTS and Application with portfolio",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.) except for applicants from English-speaking countries.This can be proved by submitting recognized certificates (for example IELTS, TOEFL etc.), if we have doubt about the quality of language skill, we will ask to seat for specific English language exam here in Germany.",
                    "programType": "Full time",
                    "courselength": "2 Semesters",
                    "degreeType": "MA",
                    "credits": "60",
                    "courseID": 6
                },
                {
                    "courseName": "Masters in Integrated Design",
                    "description": "A traditional, yet innovative approach in a historic and fascinating setting right next to (and in) the Bauhaus. The MID program incorporates the essentials of design: communication design, product design, space, audiovisual and digital media. These are blended through rigorous fundamental training and are interdisciplinary. This progressive international program focuses on the development of intercultural skills. It uses the truly synergetic power of a working environment with students from various countries and cultural backgrounds. The program requires a high level of media competence. Projects are based on both practical and experimental research. Students are encouraged to come up with systematic, creative, and individual solutions. International designers, visiting artists, and other specialists will support projects according to the topic and their professional area of specialization.",
                    "tuitionFee": "none",
                    "deadline": "15-03",
                    "requirements": "Degree in design or design related field such as architecture, art, or art history",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.) except for applicants from English-speaking countries.This can be proved by submitting recognized certificates (for example IELTS, TOEFL etc.), if we have doubt about the quality of language skill, we will ask to seat for specific English language exam here in Germany.",
                    "programType": "Full time",
                    "courselength": "3 Semesters",
                    "degreeType": "MA",
                    "credits": "90",
                    "courseID": 7
                },
                {
                    "courseName": "MBA in International Trade",
                    "description": "The international 18-month full-time accredited Master of International Trade program is focused on developing proactive, intercultural managers, consultants, and entrepreneurs for the global market – leaders in today’s dynamic business arena.",
                    "tuitionFee": "none",
                    "deadline": "15-03",
                    "requirements": "Graduate degree (Diploma, Bachelor or Master) of at least 3 years and Work experience of at least 1 year(internships count as work experience and the one year work experience required does not need to be consecutive)",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.) except for applicants from English-speaking countries.This can be proved by submitting recognized certificates (for example IELTS, TOEFL etc.), if we have doubt about the quality of language skill, we will ask to seat for specific English language exam here in Germany.",
                    "programType": "Full time",
                    "courselength": "3 Semesters",
                    "degreeType": "MA",
                    "credits": "90",
                    "courseID": 8
                },
                {
                    "courseName": "Masters in Landscape Architecture",
                    "description": "The international two-year, full-time Master of Landscape Architecture program is an accredited, design-based course of study. It is aimed at applicants from academic and professional backgrounds who wish to develop their professional leadership potential. The program provides students both theoretical and practical training in an interdisciplinary and intercultural framework. With the aim of improving the interpersonal skills of students to become effective team players, commitment to team goals and contributions to university activities are part of the educational concept. When finished, students have the tools to craft problem-oriented and sustainable solutions to landscape architectural challenges. ",
                    "tuitionFee": "none",
                    "deadline": "15-03",
                    "requirements": "Completed university degree in landscape architecture or architecture or similar</br>Recommendation</br>If necessary, a suitability interview",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.) except for applicants from English-speaking countries.This can be proved by submitting recognized certificates (for example IELTS, TOEFL etc.), if we have doubt about the quality of language skill, we will ask to seat for specific English language exam here in Germany.",
                    "programType": "Full time",
                    "courselength": "4 Semesters",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 9
                },
                {
                    "courseName": "Managing Technology for Renal Care Centers",
                    "description": "Provides fundamental knowledge and proficiency within tasks of professional and managerial staff which are required at the middle management level of Renal Care Centers.",
                    "tuitionFee": "none",
                    "deadline": "15-03",
                    "requirements": "University entrance qualification,</br>Professional experience of at least two years, practical skills and knowledge",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.) except for applicants from English-speaking countries.This can be proved by submitting recognized certificates (for example IELTS, TOEFL etc.), if we have doubt about the quality of language skill, we will ask to seat for specific English language exam here in Germany.",
                    "programType": "Full time",
                    "courselength": "Distance Learning",
                    "degreeType": "Summer",
                    "credits": "Not available",
                    "courseID": 10
                }]
            },
            {
                id: "14",
                "universityname": "Bauhaus University Weimar",
                "aboutUniversity": "The Bauhaus-Universität Weimar flourishes through its experimental environment, familiar atmosphere and especially through the people, who study, research and work here at the university. To describe the university with mere statistics would not do it justice and for that reason, we will give you a peak at what’s behind these numbers.The university has a comprehensive spectrum of disciplines ranging from subjects that are artistic and creative in nature to those that are scientifically and technically focused. Many of these degree programmes are not found anywhere else in Germany, since they are unique either in their content, the offered structure or in the specialised context.",
                "generalRequirement": "",
                "data-keyword": "",
                "country": "Germany",
                "student_payment": false,
                "application_url": "https://ww2.uni-assist.de/online/Frontend/Registrierung/index?lang=en",
                "email":"study@uni-weimar.de",
                "campusImgUrl": "",
                "universityProfilePic": "",
                "skypeID": "",
                "examinationPortal": "",
                "universityAddress": "",
                "universityLogo": "images/Bauhaus-Weimar-logo.png",
                "visibility": "show",
                "courses": [
                    {
                    "courseName": "Msc in Media Art and Design (M.F.A.)",
                    "description": "The English-language Master’s degree course in Media Art and Design (MAD) is structured along the same lines as the standard Master’s degree course in Media Art and Design.Creativity, design and experimentation – open to current trends, but also with a view to the future: that is the philosophy of the Bauhaus-Universität Weimar’s Master’s degree course in Medienkunst/Mediengestaltung (Media Art and Design). The tuition covers organisation and technology, as well as developing creative, analytical and critical skills. The combination of these disparate elements forms the main focus of the course, as it is the basic prerequisite for creative professional work in the media – either freelance or for a company. The primary goal of the course is to develop designers of strong character who will be able to enrich, and indeed determine the everyday media environment of the future with their practical knowledge and artistic creativity.",
                    "tuitionFee": "None",
                    "deadline": "15-03",
                    "requirements": "Bachelor’s degree (not less than six semesters) in a related field is compulsory,For certain courses of study, an aptitude assessment examination, aptitude test or restricted admission as mandated by the university",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.)",
                    "programType": "Full Time",
                    "courselength": "4 Semesters",
                    "degreeType": "MA",
                    "credits": "Not available",
                    "courseID": 0
                },
                {
                    "courseName": "Msc in Media Architecture",
                    "description": "Are you interested in the interplay of media and architecture? Are you looking for a study course that transcends the border between disciplines and faculties? If so, come to the Bauhaus-Universität Weimar, the only German university to offer a Media Architecture Master’s study programme! The Master’s course in Media Architecture follows in the tradition of the historic Bauhaus and its programmatic »new unity of art and technology«, offering students the ideal conditions in which to reconceptualise, extend and formulate space in an age in which all areas of life are experiencing total and global medialisation!",
                    "tuitionFee": "None",
                    "deadline": "15-03",
                    "requirements": "Bachelor’s degree (not less than six semesters) in a related field is compulsory,For certain courses of study, an aptitude assessment examination, aptitude test or restricted admission as mandated by the university",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.)",
                    "programType": "Full Time",
                    "courselength": "4 Semesters",
                    "degreeType": "MA",
                    "credits": "Not available",
                    "courseID": 1
                },
                {
                    "courseName": "Msc in European Urban Studies",
                    "description": "The Master’s degree course in European Urban Studies responds to the dynamic transformation processes affecting urban space at the beginning of the 21st century. Dispersed urban landscapes, global markets, virtual spaces, powerful players in the fields of construction and development, and postmodern Lifestyles create new challenges for the planning and design professions. The aim of the four-semester Master’s degree in European Urban Studies is to train professionals as locally and globally active experts for the urban realm.The European Urban Studies course was established in 1999 and is one of the first Master’s degree courses of its kind in Germany. A special feature of the study course is its focus on practice through the model projects undertaken in the second semester at practice partners around the world. In many cases, graduates have gone on to work for their model project partner after completing studies.",
                    "tuitionFee": "None",
                    "deadline": "15-03",
                    "requirements": "Bachelor’s degree (not less than six semesters) in a related field is compulsory, For certain courses of study, an aptitude assessment examination, aptitude test or restricted admission as mandated by the university",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.)",
                    "programType": "Full Time",
                    "courselength": "4 Semesters",
                    "degreeType": "MA",
                    "credits": "Not available",
                    "courseID": 2
                },
                {
                    "courseName": "Msc in Natural Hazards and Risks in Structural Engineering",
                    "description": "The Natural Hazards and Risks in Structural Engineering (NHRE) master’s degree programme has a strong international orientation. It trains students to apply themselves to demanding engineering tasks with regard to specific external influences, such as earthquakes. We teach students how to use modern equipment to assess the dangers and damage potential of natural phenomena, we show them how to create models and simulations, and we prepare them for conducting projects and- risk analyses of their own.In this way, the programme provides students with key qualifications for engineering positions which require innovative, enterprising solutions for dealing with a wide variety of natural dangers, like earthquakes, floods and storms.",
                    "tuitionFee": "none",
                    "deadline": "15-03",
                    "requirements": "Bachelor’s degree (not less than six semesters) in a related field is compulsory",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.)",
                    "programType": "Full Time",
                    "courselength": "4 Semesters",
                    "degreeType": "MA",
                    "credits": "Not available",
                    "courseID": 3
                },
                {
                    "courseName": "Msc in Human-Computer Interaction, M.Sc.",
                    "description": "TDesign and development of intelligent software systems and interfaces have become increasingly important with the pervasiveness of mobile devices and ubiquitous technologies. In the English-language Human-Computer Interaction Master of Science programme, students focus on theoretical and practical issues in current Computer Science research in interface design and interactive system development.",
                    "tuitionFee": "none",
                    "deadline": "15-03",
                    "requirements": "Bachelor’s degree (not less than six semesters) in a related field is compulsory",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.)",
                    "programType": "Full Time",
                    "courselength": "4 Semesters",
                    "degreeType": "MA",
                    "credits": "Not available",
                    "courseID": 4
                },
                {
                    "courseName": "Msc in Computer Science for Digital Media",
                    "description": "In the English-language Master’s degree programme Computer Science for Digital Media, students are introduced to the latest research findings in the field of interactive digital media. In addition to providing research-oriented professional training, the programme helps students acquire communication and presentation skills through their project work.",
                    "tuitionFee": "none",
                    "deadline": "15-03",
                    "requirements": "Bachelor’s degree (not less than six semesters) in a related field is compulsory",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.)",
                    "programType": "Full Time",
                    "courselength": "4 Semesters",
                    "degreeType": "MA",
                    "credits": "Not available",
                    "courseID": 5
                },
                {
                    "courseName": "Masters in Design Research",
                    "description": "The core of the MSc. program, communicated using different teaching methods with the participation of the three aforementioned partner institutions, relies on three thematic building blocks: Design as research – analysis of the synthesizing practices; design as projection – anticipation and intervention strategies; design in the world – impact and application. The participants gain sound scientific knowledge and competences on the basis of tasks that are both practice-oriented and forward-looking. The successfully completed MSc. program qualifies graduates to study for a doctorate. Moreover, the program fosters personal growth and as such paves the way for a meaningful level of social engagement. The MSc. program COOP Design Research opens up professional perspectives in the fields of research and teaching, design and cultural studies, and curatorial practice.",
                    "tuitionFee": "none",
                    "deadline": "15-03",
                    "requirements": "Completed university degree in a bachelor’s or master's degree program in Architecture or Design, Cultural Studies, or related degree programs, with a standard period of study of at least 4 years comprising 240 ECTS and Application with portfolio",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.) except for applicants from English-speaking countries.This can be proved by submitting recognized certificates (for example IELTS, TOEFL etc.), if we have doubt about the quality of language skill, we will ask to seat for specific English language exam here in Germany.",
                    "programType": "Full time",
                    "courselength": "2 Semesters",
                    "degreeType": "MA",
                    "credits": "60",
                    "courseID": 6
                },
                {
                    "courseName": "Masters in Integrated Design",
                    "description": "A traditional, yet innovative approach in a historic and fascinating setting right next to (and in) the Bauhaus. The MID program incorporates the essentials of design: communication design, product design, space, audiovisual and digital media. These are blended through rigorous fundamental training and are interdisciplinary. This progressive international program focuses on the development of intercultural skills. It uses the truly synergetic power of a working environment with students from various countries and cultural backgrounds. The program requires a high level of media competence. Projects are based on both practical and experimental research. Students are encouraged to come up with systematic, creative, and individual solutions. International designers, visiting artists, and other specialists will support projects according to the topic and their professional area of specialization.",
                    "tuitionFee": "none",
                    "deadline": "15-03",
                    "requirements": "Degree in design or design related field such as architecture, art, or art history",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.) except for applicants from English-speaking countries.This can be proved by submitting recognized certificates (for example IELTS, TOEFL etc.), if we have doubt about the quality of language skill, we will ask to seat for specific English language exam here in Germany.",
                    "programType": "Full time",
                    "courselength": "3 Semesters",
                    "degreeType": "MA",
                    "credits": "90",
                    "courseID": 7
                },
                {
                    "courseName": "MBA in International Trade",
                    "description": "The international 18-month full-time accredited Master of International Trade program is focused on developing proactive, intercultural managers, consultants, and entrepreneurs for the global market – leaders in today’s dynamic business arena.",
                    "tuitionFee": "none",
                    "deadline": "15-03",
                    "requirements": "Graduate degree (Diploma, Bachelor or Master) of at least 3 years and Work experience of at least 1 year(internships count as work experience and the one year work experience required does not need to be consecutive)",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.) except for applicants from English-speaking countries.This can be proved by submitting recognized certificates (for example IELTS, TOEFL etc.), if we have doubt about the quality of language skill, we will ask to seat for specific English language exam here in Germany.",
                    "programType": "Full time",
                    "courselength": "3 Semesters",
                    "degreeType": "MA",
                    "credits": "90",
                    "courseID": 8
                },
                {
                    "courseName": "Masters in Landscape Architecture",
                    "description": "The international two-year, full-time Master of Landscape Architecture program is an accredited, design-based course of study. It is aimed at applicants from academic and professional backgrounds who wish to develop their professional leadership potential. The program provides students both theoretical and practical training in an interdisciplinary and intercultural framework. With the aim of improving the interpersonal skills of students to become effective team players, commitment to team goals and contributions to university activities are part of the educational concept. When finished, students have the tools to craft problem-oriented and sustainable solutions to landscape architectural challenges. ",
                    "tuitionFee": "none",
                    "deadline": "15-03",
                    "requirements": "Completed university degree in landscape architecture or architecture or similar</br>Recommendation</br>If necessary, a suitability interview",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.) except for applicants from English-speaking countries.This can be proved by submitting recognized certificates (for example IELTS, TOEFL etc.), if we have doubt about the quality of language skill, we will ask to seat for specific English language exam here in Germany.",
                    "programType": "Full time",
                    "courselength": "4 Semesters",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 9
                },
                {
                    "courseName": "Managing Technology for Renal Care Centers",
                    "description": "Provides fundamental knowledge and proficiency within tasks of professional and managerial staff which are required at the middle management level of Renal Care Centers.",
                    "tuitionFee": "none",
                    "deadline": "15-03",
                    "requirements": "University entrance qualification,</br>Professional experience of at least two years, practical skills and knowledge",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.) except for applicants from English-speaking countries.This can be proved by submitting recognized certificates (for example IELTS, TOEFL etc.), if we have doubt about the quality of language skill, we will ask to seat for specific English language exam here in Germany.",
                    "programType": "Full time",
                    "courselength": "Distance Learning",
                    "degreeType": "Summer",
                    "credits": "Not available",
                    "courseID": 10
                },
                {
                    "courseName": "International Doctorate Programme European Urban Studies",
                    "description": "With the reaccreditation of the study programmes European Urban Studies and Advanced Urbanism the programmes underwent important changes in structure and content.The study programme European Urban Studies, together with the internship of Model Projects has been strengthened towards practice and design and is offered as Integrated Urban Development and Design (IUDD) at the bauhaus.institute for experimental architecture (ifex). ",
                    "tuitionFee": "none",
                    "deadline": "15-03",
                    "requirements": "At least a good Master`s degree (M.A.) or equivalent from a recognised university in a subject related to spatial research as well as a very good previous academic performance are required for admission to the doctorate programme.</br>The following documents are required for application:</br>Application Form:  Fill in our online application form with all required documents. After submitting it online, you will be notified by the program coordinator.</br>Curriculum Vitae</br>Letter of Motivation (one page)</br>Research Proposal (Exposé): A detailed description (ca. 5 pages) of your intended research should outline the topic of your doctoral dissertation and your research methods. It should reflect on the state of the art research in the field you are interested in. Be sure to specifically point out possible field research abroad that will be required for your research. Finally, a bibliography of books and research articles, which are most relevant for your topic, should be attached to the exposé.</br>Certificates and Transcripts: The application must include an officially authenticated copy of the student's university entrance qualification. Complete and official certificates and transcripts of all previous college or university study must be submitted. Official transcripts should either be submitted as an original document or the submitted copies should be officially certified. All documents must be provided in the original language. Documents in languages other than English or German must be accompanied by officially certified translations into English (or German). Official certifications can be carried out by a notary public, the German Embassy or Consulate in your home country, and the institutions that originally issued the document. The certificates and transcripts should include the grade point average, the grades received in each subject each year, the number of weeks and the number of hours per week that each subject was studied.</br>Letters of Recommendation: Two letters of recommendation from academic mentors of your home university. You can download a form of the letter of recommendation under this link.",
                    "courselanguage": "English",
                    "language": "English B2 approval (TOEFL, IELTS, Cambridge Language Examination etc.) except for applicants from English-speaking countries.This can be proved by submitting recognized certificates (for example IELTS, TOEFL etc.), if we have doubt about the quality of language skill, we will ask to seat for specific English language exam here in Germany.",
                    "programType": "Full time",
                    "courselength": "6 Semesters",
                    "degreeType": "PHD",
                    "credits": "Not available",
                    "courseID": 11
                }]
            },
            {
                id: "15",
                "universityname": "Gdansk University Of Technology",
                "aboutUniversity": "The cornerstone of the university building was embedded on the 7th of June 1900. Executive design of the Gdańsk University of Technology campus, which was then called The Royal Institute of Technology in Gdańsk, was prepared by Prof. Albert Carsten, an outstanding architect. The architectural concept was designed by Hermann Eggert and Georg Thür. The Main Building was designed in the Dutch Renaissance Revival style and distinguished as a well kept monument by the Polish Minister of Culture and National Heritage.</br>The Gdańsk University of Technology campus is one of the ten most beautiful in Europe according to a list of European universities distinguished by wonderful architecture and attractive location prepared by the Times Higher Education portal in 2018. GUT was ranked among the universities in Bologna, Salamanca and Uppsala.</br>On the 22nd of September 2010, by decision of the Gdańsk University of Technology Senate, the southern courtyard (equipped with the Foucalt pendulum) was named after Johannes Hevelius, while the northern one was dedicated to Daniel Gabriel Fahrenheit. The courtyards were fitted with images of these famous Gdańsk citizens.",
                "generalRequirement": "",
                "data-keyword": "",
                "country": "Poland",
                "student_payment": false,
                "application_url": "https://gut.dreamapply.com/applicant/register",
                "email":"international@pg.edu.pl",
                "campusImgUrl": "",
                "universityProfilePic": "",
                "skypeID": "",
                "examinationPortal": "",
                "universityAddress": "",
                "universityLogo": "images/gdansk-university-logo-pg-en.png",
                "visibility": "show",
                "courses": [
                    {
                    "courseName": "Bachelor of Science in Green Technologies and Monitoring",
                    "description": "Green Technologies and Monitoring is a new direction of study at GUT. It is aimed at students wishing to learn and understand the technologies required to protect our environment. Students will gain practical as well as theoretical knowledge covering all fields of green and new technologies and environmental analysis and monitoring. The students will have a solid understanding of environmental and analytical chemistry, ecology, and process engineering. The course will focus on hands-on laboratory experience and skill-set based engineering project work",
                    "tuitionFee": "2000",
                    "deadline": "15-03",
                    "requirements": "High school / secondary education (or higher)</br>The entry qualification documents are accepted in the following languages: English / Polish.</br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.</br>You must take the original entry qualification documents along with you when you finally go to the university.",
                    "courselanguage": "English",
                    "language": "FCE or CAE, IELTS 6+ or TOEFL 79+",
                    "programType": "Full Time",
                    "courselength": "4 Semesters",
                    "degreeType": "BA",
                    "credits": "210",
                    "courseID": 0
                },
                {
                    "courseName": "Bachelor in Management",
                    "description": "BiM is a comprehensive, practice-relevant three-year degree. It is unique in Poland and spans across all spheres of business and management. It provides knowledge that helps to build comprehensive managerial competences. Professionally qualified managers are the key drivers of trade, commerce and public service, making decisions to help shape the world around them. What kind of qualities should they have? First of all, they should be knowledgeable about the contemporary economy and should be able to put this knowledge into use when managing companies. They should also be good organizers. Good managers should be creative, responsible, communicative and entrepreneurial. That is why BiM is a place for people who are full of initiative and original ideas, outgoing, and who can communicate in foreign languages. BiM is designed to give you the knowledge, confidence and choices you need to establish a rewarding and exciting career in a wide variety of settings.",
                    "tuitionFee": "1000",
                    "deadline": "15-03",
                    "requirements": "High school / secondary education (or higher)</br>The entry qualification documents are accepted in the following languages: English / Polish.</br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.</br>You must take the original entry qualification documents along with you when you finally go to the university.",
                    "courselanguage": "English",
                    "language": "FCE or CAE, IELTS 6+ or TOEFL 79+",
                    "programType": "Full Time",
                    "courselength": "3 years",
                    "degreeType": "BA",
                    "credits": "180",
                    "courseID": 1
                },
                {
                    "courseName": "Bachelor in Energy Technologies",
                    "description": "The programme of the studies allows the students to obtain the detailed theoretical knowledge as well as the practical expertise of different aspects related to Power Engineering, Energy Technologies and Energy Conservation, taking into account design, production, exploitation, diagnostics and maintenance of power and heat plants, power transmission systems and energy distribution installations. The programme is based on the CDIO (Conceive – Design – Implement – Operate) Concept emphasizing design issues.",
                    "tuitionFee": "0.00",
                    "deadline": "15-03",
                    "requirements": "High school / secondary education (or higher)</br>The entry qualification documents are accepted in the following languages: English / Polish.</br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.</br>You must take the original entry qualification documents along with you when you finally go to the university.",
                    "courselanguage": "English",
                    "language": "FCE or CAE, IELTS 6+ or TOEFL 79+",
                    "programType": "Full Time",
                    "courselength": "3.5 years",
                    "degreeType": "BA",
                    "credits": "210",
                    "courseID": 2
                },
                {
                    "courseName": "Bachelor in Data Engineering",
                    "description": "Making important decisions is always based on collecting and analysing huge amounts of information. Data engineering helps achieve this goal by combining the experience and expertise of two areas: information technology and management. Students of this field of study will learn how to deal with large amounts of data from different sources and how to interpret them. All this is based on the computer programmes and algorithms, and knowledge of mathematics, statistics, and economics. Due to a significant number of practical classes one can be sure that after graduation they will not only be theoreticians, but experts prepared to work in the business environment.",
                    "tuitionFee": "4000",
                    "deadline": "15-03",
                    "requirements": "High school / secondary education (or higher)</br>The entry qualification documents are accepted in the following languages: English / Polish.</br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.</br>You must take the original entry qualification documents along with you when you finally go to the university.",
                    "courselanguage": "English",
                    "language": "FCE or CAE, IELTS 6+ or TOEFL 79+",
                    "programType": "Full Time",
                    "courselength": "3.5 years",
                    "degreeType": "BA",
                    "credits": "213",
                    "courseID": 3
                },
                {
                    "courseName": "Bachelor in Mechanical Engineering",
                    "description": "The programme of the studies allows the students to obtain the detailed theoretical knowledge as well as the practical expertise of different aspects related to Power Engineering, Energy Technologies and Energy Conservation, taking into account design, production, exploitation, diagnostics and maintenance of power and heat plants, power transmission systems and energy distribution installations. The programme is based on the CDIO (Conceive – Design – Implement – Operate) Concept emphasizing design issues.",
                    "tuitionFee": "0.00",
                    "deadline": "15-03",
                    "requirements": "High school / secondary education (or higher)</br>The entry qualification documents are accepted in the following languages: English / Polish.</br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.</br>You must take the original entry qualification documents along with you when you finally go to the university.",
                    "courselanguage": "English",
                    "language": "FCE or CAE, IELTS 6+ or TOEFL 79+",
                    "programType": "Full Time",
                    "courselength": "3.5 years",
                    "degreeType": "BA",
                    "credits": "210",
                    "courseID": 4
                },
                {
                    "courseName": "Msc in Ocean Engineering",
                    "description": "The aim is providing advanced engineering knowledge in the field of Ocean Engineering including two main specializations: Ship Technology and Offshore Engineering, Marine Engineering and Offshore Energy. Students will gain detailed knowledge within the subjects such as Marine Applied Informatics, CAE and Design Tools, Ship and Offshore Power Systems Design, Dynamics of Ship and Offshore Structures, Advanced Mechanics of Marine Structures, Ship and Offshore Structures Design, Marine and Offshore Systems and Equipment’s, Modelling and Simulation in Ocean Engineering, Reliability, Safety and Risk Analysis, Advanced Material Engineering and Manufacturing Technology, Marine and Intermodal Transport, Finance and Economy in Engineering Design, Maritime Environmental Protection and Optimization in Engineering Design. They deal with a real design process and prepare the final thesis in cooperation with the industrial partners of the Faculty.The programme is supported and organized In cooperation with Det Norske Verits – Germanischer Lloyd (DNV GL).",
                    "tuitionFee": "1500",
                    "deadline": "15-03",
                    "requirements": "The entry qualification documents are accepted in the following languages: English / Polish.</br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.</br>1.Bachelor Diploma with legalization or Apostille</br>2.Transcript of Records</br>3.Medical certificate</br>You must take the original entry qualification documents along with you when you finally go to the university.",
                    "courselanguage": "English",
                    "language": "FCE or CAE, IELTS 6+ or TOEFL 79+",
                    "programType": "Full Time",
                    "courselength": "2 years",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 5
                },
                {
                    "courseName": "Mechanical Engineering, specialization: International Design Engineer",
                    "description": "The major objective for students is to acquire theoretical knowledge in advanced topics in the area of mechanics and machine construction and operation, as well as practical expertise in the application of this knowledge. Graduates from this course will have a well-founded knowledge of the principles of mechanics, design and manufacturing with the aid of modern computational tools; be able to execute works aiding machine design and construction of materials, and carry out supervision of their operation; be fluent in utilizing modern engineering computer software and harnessing modern technologies; be able to undertake doctoral studies; be able to lead teams and companies; have the ability to utilize the acquired knowledge at work and in daily life; have the ability and skills needed to establish and manage small companies, as well as being familiar with the necessary legislation to run small and medium enterprises.",
                    "tuitionFee": "4200",
                    "deadline": "15-03",
                    "requirements": "The entry qualification documents are accepted in the following languages: English / Polish.</br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.</br>1.Bachelor Diploma with legalization or Apostille</br>2.Transcript of Records</br>3.Medical certificate</br>You must take the original entry qualification documents along with you when you finally go to the university.",
                    "courselanguage": "English",
                    "language": "FCE or CAE, IELTS 6+ or TOEFL 79+",
                    "programType": "Full Time",
                    "courselength": "1.2 years",
                    "degreeType": "MA",
                    "credits": "90",
                    "courseID": 6
                },
                {
                    "courseName": "MA in Management, specialization: International Management",
                    "description": "The objective of this new Master’s programme in International Management is to develop future professionals capable of developing resourceful and innovative skills, and able to pursue successful opportunities in the dynamic international environment. This Master’s in International Management offers an opportunity to expand your experience by deepening your knowledge in finance, human resources, operations and marketing among other strategic areas, all presented in an international context. The international management knowledge and skills are advanced through academically rigorous courses and various interactive teaching methods.",
                    "tuitionFee": "5000",
                    "deadline": "15-03",
                    "requirements": "The entry qualification documents are accepted in the following languages: English / Polish.</br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.</br>1.Bachelor Diploma with legalization or Apostille</br>2.Transcript of Records</br>3.Medical certificate</br>You must take the original entry qualification documents along with you when you finally go to the university.",
                    "courselanguage": "English",
                    "language": "FCE or CAE, IELTS 6+ or TOEFL 79+",
                    "programType": "Full Time",
                    "courselength": "2 years",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 7
                },
                {
                    "courseName": "Msc in Economic Analytics",
                    "description": "Master in Economic Analysis offers candidates an in-depth knowledge in the field of macro and microeconomics, finance and accounting and provides an expanded range of quantitative methods allowing to conduct effective analyzes in areas which are the basis for decision-making, both in the enterprise and specialized financial institutions. Analysis are supported with computer software. This programme, delivered in English, broadens your knowledge and skills in macroeconomics and helps to understand economic growth and development issues in the globalization era.",
                    "tuitionFee": "5000",
                    "deadline": "15-03",
                    "requirements": "The entry qualification documents are accepted in the following languages: English / Polish.</br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.</br>1.Bachelor Diploma with legalization or Apostille</br>2.Transcript of Records</br>3.Medical certificate</br>You must take the original entry qualification documents along with you when you finally go to the university.",
                    "courselanguage": "English",
                    "language": "FCE or CAE, IELTS 6+ or TOEFL 79+",
                    "programType": "Full Time",
                    "courselength": "2 years",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 8
                },
                {
                    "courseName": "Msc in Electronics and Telecommunications",
                    "description": "Courses prepare professional specialists in telecommunication systems and networks, especially cellular and trunked radio-communication, land, marine and air mobile radio-communication, personal radio-communication, wireless data transmission systems, digital radio and TV broadcast, design and implementation of services of commercial and dedicated radio-communication networks, satellite and land-based radio-navigation systems.NB! Programme is preceded by Preparatory Semester",
                    "tuitionFee": "4000",
                    "deadline": "15-03",
                    "requirements": "The entry qualification documents are accepted in the following languages: English / Polish.</br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.</br>1.Bachelor Diploma with legalization or Apostille</br>2.Transcript of Records</br>3.Medical certificate</br>You must take the original entry qualification documents along with you when you finally go to the university.",
                    "courselanguage": "English",
                    "language": "FCE or CAE, IELTS 6+ or TOEFL 79+",
                    "programType": "Full Time",
                    "courselength": "1 semester preparatory + 3 semesters master programme",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 9
                },
                {
                    "courseName": "Msc in Electronics and Telecommunications",
                    "description": "The CES specialization graduate obtains the knowledge and skills in a field of:</br>-	classification of so called electronic infosystems: measurement, diagnostics, alarm, telemetric, person and product identification, object protection, car electronics, metrological support of production, mechatronics,</br>-	modeling, design and construction of electronic systems taking into account required reliability and electromagnetic compatibility and programming using modern tools (LabWindows/CVI, LabView, Visual C++, Matlab),</br>-	subject of electronic systems, starting from microsystems, through standard system, up to macrosystems, as well as distributed systems based on computer networks</br>The graduate gains the constructor skills allowing standalone work in different professional environment or to establish a company producing electronic modules, measurement instruments, alarm systems, car electronics..",
                    "tuitionFee": "4000",
                    "deadline": "15-03",
                    "requirements": "The entry qualification documents are accepted in the following languages: English / Polish.</br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.</br>1.Bachelor Diploma with legalization or Apostille</br>2.Transcript of Records</br>3.Medical certificate</br>You must take the original entry qualification documents along with you when you finally go to the university.",
                    "courselanguage": "English",
                    "language": "FCE or CAE, IELTS 6+ or TOEFL 79+",
                    "programType": "Full Time",
                    "courselength": "3 semesters master programme ",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 10
                },
                {
                    "courseName": "Msc in Informatics",
                    "description": "Courses are offered in the fields of internet system architectures and their related design problems, distributed and parallel algorithms, applications of artificial intelligence, platforms for collaborative work and ambient intelligence. NB! Programme is preceded by Preparatory Semester",
                    "tuitionFee": "4000",
                    "deadline": "15-03",
                    "requirements": "The entry qualification documents are accepted in the following languages: English / Polish.</br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.</br>1.Bachelor Diploma with legalization or Apostille</br>2.Transcript of Records</br>3.Medical certificate</br>You must take the original entry qualification documents along with you when you finally go to the university.",
                    "courselanguage": "English",
                    "language": "FCE or CAE, IELTS 6+ or TOEFL 79+",
                    "programType": "Full Time",
                    "courselength": "1 semester preparatory + 3 semesters master programme",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 11
                },
                {
                    "courseName": "Msc in Control Engineering and Robotics",
                    "description": "Courses focus on the most important topics of modern control theory, such as optimal control, stochastic control, robust control,fuzzy control and adaptive control, as well as on the problems of systems identification and adaptive signal processing. They provide knowledge allowing one to design high-performance, flexible and robust digital control systems for a wide range of applications.NB! Programme is preceded by Preparatory Semester.",
                    "tuitionFee": "4000",
                    "deadline": "15-03",
                    "requirements": "The entry qualification documents are accepted in the following languages: English / Polish.</br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.</br>1.Bachelor Diploma with legalization or Apostille</br>2.Transcript of Records</br>3.Medical certificate</br>You must take the original entry qualification documents along with you when you finally go to the university.",
                    "courselanguage": "English",
                    "language": "FCE or CAE, IELTS 6+ or TOEFL 79+",
                    "programType": "Full Time",
                    "courselength": "3 semesters master programme ",
                    "degreeType": "MA",
                    "credits": "120",
                    "courseID": 12
                },
                {
                    "courseName": "Msc in Architecture",
                    "description": "Courses cover a wide scope of issues from the architectural and urban theory and design, advanced structures and materials, conservation of monuments to urban renewal strategies. Diploma awarded after completion of the second degree studies are formally recognized (in accordance with Directive 2005/36/EC) as a proof of obtaining qualifications of an architect in the European Union.",
                    "tuitionFee": "0.00",
                    "deadline": "15-03",
                    "requirements": "The entry qualification documents are accepted in the following languages: English / Polish.</br>Often you can get a suitable transcript from your school. If this is not the case, you will need official translations along with verified copies of the original.</br>1.Bachelor Diploma with legalization or Apostille</br>2.Transcript of Records</br>3.Medical certificate</br>You must take the original entry qualification documents along with you when you finally go to the university.",
                    "courselanguage": "English",
                    "language": "FCE or CAE, IELTS 6+ or TOEFL 79+",
                    "programType": "Full Time",
                    "courselength": "1,5 years",
                    "degreeType": "MA",
                    "credits": "90",
                    "courseID": 13
                }]
            }
            //End universities aray       
        ] //End Universities Info Array

    }; //End Var Data

   var dataCountries = {
     countriesinfo : [{
     "countryID":0,    
     "countryName":"Austria",
     "embassyEmail":"consularsection@austria.org",
     "countryPhone":"+4305011500",
     "visaRequirements":"The following list of documents are required for Austrian Schengen visa application:<br><br>Austrian visa application form. <br><br>Two identical photos.(The photos should be of passport format – a recent whole-face capture with a light background. See photograph requirements & specifications.)<br><br>Your passport/Travel document:Valid for at least 3 months beyond your planned date of departure from Austria (the Schengen zone).No older than 10 years.And it should contain at least two blank pages.Copies of your previous Schengen visas (if applicable).<br><br>Schengen Travel Insurance. Confirmation that you have travel insurance for Austria and the whole territory of Schengen, with a minimum 30,000 € coverage of medical emergencies.<br><br>A cover letter. In which you state the purpose of visit to Austria and you present a detailed trip itinerary.<br><br>Round-trip Flight Itinerary. Containing the dates and flight numbers specifying entry and exit from Austria.<br><br>Proof of accommodation. I.e. Hostel reservation for the whole duration of the intended stay in Austria. Find and Book Cheap Hotels in Austria on the app<br><br>Proof of civil status. This could be a marriage certificate, birth certificate of children, death certificate of spouse, etc.<br><br>Proof of sufficient financial means for the period of stay in Austria.",
     "embassyWebsite":"https://www.migration.gv.at/",
     "embassyBookingPortal":"https://appointment.bmeia.gv.at/",
     "embassyButtonText":"Complete Schedule",
     "countryPicture": "images/universities-in-vienna.png",
     "countryIcon": "images/austria.png",
     "countryVideo": "https://www.youtube.com/embed/xHUTACt84n0",
     "whyThisCountry":{
     "transportInfo": "Austria has a well-developed public transport network. Buses, trains, trams and underground lines will take you almost anywhere in the city in no time at all. Vienna public transport Wiener Linien operates five underground lines, 29 tram and 127 bus lines, of which 24 are night lines. Night lines only operate between 0.30 am and 5 am. On weekends and public holidays the Vienna underground remains at the service of its passengers all night. The Wiener Linien vehicle fleet currently consists of over 500 tramcars and more than 450 buses. A single ticket costs EUR 2.40.",
     "costOfLiving": "Although Austria is counted among the richest countries of the world, the general cost of living in Austria is not so high compared to other European countries.<br><h2 class='title-new'>How much money will I need?</h2>In the following listing you will find an estimate of the monthly living costs for students (in euros). These figures only serve as a guideline and cannot be seen as binding. Under accommodation costs, a place in a student hall of residence has been used as the basis of calculation.<br><br>Accommodation approx. 400 euros<br>the costs depend on the city in which you want to study, what is included in the rent and the arrangements made by the institution. Housing in Vienna, for example, is more expensive than in smaller towns. You can find more information about housing in our section on accommodation.<br><br>Food (excluding luxuries and tobacco) approx. 250 euros<br><br>Fortunately, Austria has many discount supermarkets, which offer food at reasonable prices. Many universities have so called self-service student cafeterias (Mensa) where you can get a good meal at a good price. But the cheapest way to eat is to do your own cooking. Some average prices: a cup of coffee/tea in a café: 3 euros, a sandwich at a bakery: 3,50 euros, a dinner in a typical student restaurant: 10 euros.<br><br>Studies and personal requirements (books, culture, recreation): approx. 300 euros<br>A metro or bus ticket cost around 2,20 euros for a single fare in the city, a cinema ticket cost approximately 9 euros and a ticket for a museum about 8 euros. However, students are eligible for a number of price concessions. Public transportation authorities and many museums, cinemas, theatres and other cultural venues give student discounts when you show your student card.<br><br>Total per month approx. 950 Euros<br><br>The average monthly living expenses for a student in Austria are approximately 950 euros. This may vary a bit, depending on your study location – for example, accommodation and other living costs may be higher in Vienna and other larger cities than for example in Wr.Neustadt. And, of course, the amount of money you will need greatly depends on how economically you live. Therefore, it is difficult to say exactly how much money a student in Austria needs per month.",
     "whyStudyInThisCountry": "Officially the Republic of Austria (German: Republik Österreich,), is a country of nearly 9 million people in Central Europe. It is bordered by the Czech Republic and Germany to the north, Hungary and Slovakia to the east, Slovenia and Italy to the south, and Switzerland and Liechtenstein to the west. The territory of Austria covers 83,879 km2 (32,386 sq mi). The terrain is highly mountainous, lying within the Alps; only 32% of the country is below 500 m (1,640 ft), and its highest point is 3,798 m (12,461 ft). The majority of the population speaks local Bavarian dialects as their native language,and German in its standard form is the country's official language.Other local official languages are Hungarian, Burgenland Croatian, and Slovene.<br><br>Austria is a federal republic with a parliamentary representative democracy comprising nine federated states.The capital and largest city, with a population exceeding 1.8 million, is Vienna.Other major urban areas of Austria include Graz, Linz, Salzburg and Innsbruck. Austria is consistently ranked as one of the richest countries in the world by per capita GDP terms. The country has developed a high standard of living and in 2018 was ranked 20th in the world for its Human Development Index. The republic declared its perpetual neutrality in foreign political affairs in 1955. Austria has been a member of the United Nations since 1955,joined the European Union in 1995,and is a founder of the OECD.Austria also signed the Schengen Agreement in 1995,[16] and adopted the euro currency in 1999.<br><br>Austria is an ideal destination for studying. Austria is located in the centre of Europe. In Austria you will find 70 top class universities with more than 350,000 university students, 25% of them are international students.Austria offers you a broad spectrum of study opportunities,various programmes taught in English,great social security and economic stability generous hospitality and an overwhelming landscape,exciting cultural attractions and outdoor activities.This is why Austria is the ideal place for studying and living!"}
     },
     {
        "countryID":1,    
        "countryName":"Hungary",
        "embassyEmail":"migracio@bah.b-m.hu",
        "countryPhone":"+36 1 463 9100",
        "visaRequirements":"•	Applicant’s passport + copy (minimum 1 year validity)<br><br> •	A filled visa application form which may be downloaded from the home page of Office of Immigration and Nationality: www.bmbah.hu (Enter / Administration / Standard forms)<br><br>•1 application form completed and signed<br><br>•	A•	One passport size photograph. The photos should measure 35 x 45 mm. The length of the face (hair included) should not be smaller than 25 mm or longer than 35 mm.  The background should be in WHITE. A photo with shadows or colour changes is not acceptable<br><br>•	Travel Insurance covering one month<br><br>•Parent's or guardian’s bank statements<br><br>•	Summarised statement from the respective bank to show the balance in Euros or Dollars (must be notarised)br><br>•	Letter from the employer<br><br>•	Commitment letter from the parent or guardian that he or she will support the student during his / her education in Hungary. (must be notarised)<br><br>•	Proof of sufficient funds of the guarantor - The guarantor must have adequate means of subsistence and stand surety for any costs incurred by the student in terms of health treatment, residence in Hungary and repatriation, for at least one academic year. The guarantor must have a regular income. <br><br>•	Evidence of relationship with sponsor<br><br>•University letter, Proof of registration <br><br>•	Evidence of fees paid, tuition fees and accommodation<br><br>•	Confirmation of WAEC result<br><br>•	Students degree and academic records, Proof of studies: - equivalent Diploma or degree requested (legalized)<br><br>•	The certificate of the receiving institution<br><br>•	An evidence of your accommodation in Hungary.<br>•	Visa fee of Eur. 60.00 per student plus 40 Euros for the courier service – for sending the passport back to the visa applicant after visa issuance (40 Euros fee is to be paid by those applicants residing outside Kenya), 25 Euros as a consular fee",
        "embassyWebsite":"http://www.bmbah.hu/index.php?lang=en",
        "embassyBookingPortal":"https://ifr.mfa.gov.hu/Idopontfoglalas/Pages/Idopontfoglalas.aspx",
        "embassyButtonText":"Select Interview Date",
        "countryPicture": "images/universities-in-budapest.png",
        "countryIcon": "images/hungary.png",
        "countryVideo": "https://www.youtube.com/embed/-19iSkKJ5Wo?rel=0&amp;controls=0&amp;showinfo=0&amp;start=10",
        "whyThisCountry":{
        "transportInfo": "Most of Budapest's city center and historic districts are suitable for walking. There are pedestrian precincts in downtown Pest and traffic is restricted on Castle Hill, so walking is probably the best way to get around. However, Budapest also has an excellent public transportation system. Glance skyward and you'll see that most of the city's streets are lined with cables, as Budapest has a vast system of streetcars (or trams) and trolley buses. Budapest also has a clean, fast, and efficient subway system (or metro as the locals call it). Outer suburbs are well served by HÉV trains (suburban railway).<br><br>Getting around is easy. Although walking is probably your best bet, streetcars 2, 4 and 6 as well as the three subway lines are also good options to get to most places in the city.<br><br>Subway (Metro) – Budapest has three subway lines and the fourth one, Metro 4, is currently under construction.<br><br>M1 or Millennium Underground (yellow line) - runs under Andrássy Avenue in Pest, between Vörösmarty tér and Mexikói út<br><br>M2 (red line) - runs east west, between Déli pályaudvar and Örs vezér tere<br><br>M3 (blue line) - runs north south in Pest, between Újpest-Központ and Kőbánya-Kispest<br><br>M4 - runs between Kelenföldi pályaudvar and Keleti pályaudvar<br><br>Ticket prices<br><br>Single ticket (vonaljegy) - HUF 350<br><br>Transfer ticket (átszállójegy) - HUF 530 (valid for a single journey with one transfer)<br><br>One-day travel card (napijegy) - HUF 1,650<br><br>Three-day travel card - HUF 4,150<br><br>Seven-day travel card - HUF 4,950<br><br>Ten-trip coupon book (gyűjtőjegy) - HUF 3,000<br><br>There are passes available for longer periods (14 days - HUF 7,000, monthly - HUF 10,500, etc) but they do require photo ID. ID's, valid for one year, are issued at metro stations. You will need one passport size photo, available at photo booths located next to the ticket vendors. A set of 4 prints cost HUF 1,000, but you get to keep 3. More information is available at www.bkv.hu.<br><br>Having a ticket doesn't entitle you to ride public transportation. You must validate your ticket at a ticket-punching machine when starting your trip. Transfer tickets must be validated twice. First, when entering the system and also at the point of transfer, using either ends of the ticket. Hungarians may understand the way the ticket system works; however, it's still the source of the majority of complaints received from tourists. They buy their tickets in good faith but forget to validate them and have to pay a substantial fine when caught. It's an awful system by design, as you are able to enter/use all public transport without validating your ticket, until an undercover controller stops you. All forms of public transportation are frequented by controllers, so you are bound to run into one sooner or later, and they are not very pleasant to deal with.",
        "costOfLiving": "Furthermore, Budapest is one of the best cities for expats. The city is breathtaking and the price levels of goods and services are relatively low compared to the surrounding countries. Also Budapest has an international airport and three international railway stations which makes travelling comfortable and easy in and out of the city.<br><br>One of the main reason behind the growing number of foreign companies and employees in Budapest might be the location of the city. From Budapest it is convenient to do business with any part of the world but with a significantly lower operational cost than from Western Europeans countries.<br><br>The cost of living in Budapest is still more affordable than in most of the European countries thanks to the cheap public transport and general services. However the rent rate in city is continuously growing and getting closer to the Western European housing prices.<br><br>FOOD<br><br><br>1 liter of milk	0.80 USD<br>1 loaf of bread	0.75 USD<br>1 kg of tomatoes	2.04 USD<br>1 kg of chicken	3.55 USD<br>1 single meal cheap restaurant	4.55 USD<br>1 single meal high-end restaurant	19.32 USD<br>1 cappuccino or latte	2.03 USD<br>1 big pizza delivery	8.24 USD<br><br>ACCOMODATION<br>Apartment: 250 -300 Euro<br>Hostel:<br>8,000 (26 Euros)/ 2 nights,Double room, Incl. breakfast",
        "whyStudyInThisCountry": "Hungary (Hungarian: Magyarország) is a country in Central Europe.Spanning 93,030 square kilometres (35,920 sq mi) in the Carpathian Basin, it borders Slovakia to the north, Ukraine to the northeast, Austria to the northwest, Romania to the east, Serbia to the south, Croatia to the southwest, and Slovenia to the west.With about 10 million inhabitants, Hungary is a medium-sized member state of the European Union.The official language is Hungarian, which is the most widely spoken Uralic language in the world.Hungary's capital and its largest city and metropolis is Budapest. Other major urban areas include Debrecen, Szeged, Miskolc, Pécs and Győr.<br><br>The territory of modern Hungary was for centuries inhabited by a succession of peoples, including Celts, Romans, Germanic tribes, Huns, West Slavs and the Avars. The foundations of the Hungarian state was established in the late ninth century AD by the Hungarian grand prince Árpád following the conquest of the Carpathian Basin. His great-grandson Stephen I ascended the throne in 1000, converting his realm to a Christian kingdom. By the 12th century, Hungary became a regional power, reaching its cultural and political height in the 15th century.Following the Battle of Mohács in 1526, Hungary was partially occupied by the Ottoman Empire (1541–1699). It came under Habsburg rule at the turn of the 18th century, and later joined Austria to form the Austro–Hungarian Empire, a major European power.<br><br>The Austro-Hungarian Empire collapsed after World War I, and the subsequent Treaty of Trianon established Hungary's current borders, resulting in the loss of 71% of its territory, 58% of its population, and 32% of ethnic Hungarians.Following the tumultuous interwar period, Hungary joined the Axis Powers in World War II, suffering significant damage and casualties. Hungary became a satellite state of the Soviet Union, which contributed to the establishment of a socialist republic spanning four decades (1949–1989 The country gained widespread international attention as a result of its 1956 revolution and the seminal opening of its previously-restricted border with Austria in 1989, which accelerated the collapse of the Eastern Bloc.On 23 October 1989, Hungary became a democratic parliamentary republic.<br><br>In the 21st century, Hungary is a middle powerand has the world's 57th largest economy by nominal GDP, as well as the 58th largest by PPP, out of 191 countries measured by IMF. As a substantial actor in several industrial and technological sectors, it is the world's 35th largest exporter and 34th largest importer of goods. Hungary is an OECD high-income economy with a very high standard of living. It keeps up a social security and universal health care system, and a tuition-free university education.Hungary performs well in international rankings: it is 20th in quality of life, 24th in the Good Country Index, 28th in inequality-adjusted human development, 32nd in the Social Progress Index, 33rd in the Global Innovation Index and ranks as the 15th safest country in the world.<br><br>Hungary joined the European Union in 2004 and has been part of the Schengen Area since 2007. Hungary is a member of the United Nations, NATO, WTO, World Bank, the AIIB, the Council of Europe, the Visegrád Group and more.Well known for its rich cultural history, Hungary has contributed significantly to arts, music, literature, sports and science and technology. Hungary is the 11th most popular country as a tourist destination in Europe, attracting 14.3 million international tourists in 2015.It is home to the largest thermal water cave system and the second largest thermal lake in the world, the largest lake in Central Europe and the largest natural grasslands in Europe."}
        },
        {
           "countryID":2,    
           "countryName":"Germany",
           "embassyEmail":"ausbildung@bamf.bund.de",
           "countryPhone":"+493018151111",
           "visaRequirements":"Step 1 – Prepare your visa application<br><br>Depending on the purpose of your visit to Germany please check the appropriate visa type you need to apply for, the visa fees and all the required documents. Complete and sign the application form and collect all the required documents before applying.<br><br>* Please ensure that you complete the form in full, – please also print, sign and bring with you when attending your Visa appointment. Handwritten forms are not be accepted.<br><br>Step 2 – Make an appointment<br><br>It is mandatory that you book an appointment before you can go to the Application center to submit your documents for a German VISA. All visa applications are accepted only if you have made prior appointment.<br><br>Step 3 – Go to the Application Center<br><br>After you arrive at the Application Center, your appointment letter will be verified and you will be issued a token. Please be on time, the embassy may not be able to process your visa request if you are late for more than 10 minutes.<br><br>Step 4 – Visa application submission<br><br>The submission process generally takes 10 minutes to complete. Your documents and visa application form will be checked and verified. Please make sure that:<br><br>All your documents are arranged in the order stated on the checklist Your application form is complete and signed<br><br> You will be asked to collect another token if the visa application form is incomplete, you have not arranged the documents in the required order or you have not provided all the necessary photocopies of documents.If the application is complete your passport, application form and documents will be held temporarily by the application center. Please note that you can not take the passport during the application process with you, if you have to take your passport for whatever reason the application will be canceled and you will need to re-apply.<br><br>Step 5 – Entering of application information<br><br>After the verification of your application, all the application form information will be entered into the on-line system of the German consulate and you will receive a printed copy of your application. This process usually takes about 10 to 15 minutes. After you get the printed form please make sure to verify all the details are correct and sign the form.Please note that forms for minors (up to 18 years) have to be signed by both parents.<br><br>After you pay for the visa you will be issued a receipt which you have to keep in order to collect your processed application.<br><br>Step 6 – Biometric data collection<br><br>Once the application has been completed, biometrics will be collected using a quick process that captures a 10-digit fingerprint scan with a digital finger scanner. This will usually take 7-8 minutes per applicant. <br><br><a href='https://www.germany-visa.org/application-process/'>Source: GermanVisa.org</a>",
           "embassyWebsite":"http://www.bamf.de/EN/Migration/Studieren/studieren-node.html",
           "embassyBookingPortal":"https://videx.diplo.de/videx/desktop/index.html#start",
           "embassyButtonText":"Complete Application",
           "countryPicture": "images/universities-in-berlin.png",
           "countryIcon": "images/germany.png",
           "countryVideo": "https://www.youtube.com/embed/5VXCjgrvmoc",
           "whyThisCountry":{
           "transportInfo": "Public Transport in Germany and Europe is usually excellent. It is very practical to live in any large German city or metropolitan area without owning a car. Even medium-sized cities have good public transportation networks that use buses, trams, and urban/suburban rail lines to move people around.<br><br>Because most public transportation systems in Germany are regional, a ticket for the S-Bahn is also valid for a streetcar or bus. For instance, the S-Bahn in Berlin is a subsidiary of Deutsche Bahn, the national railway, but it is also part of the Transport Association Berlin-Brandenburg (VBB). That means a ticket bought at an S-Bahn station is also valid for buses, the U-Bahn, or trams. If you buy a ticket from a bus driver (normal practice in Berlin), it is also valid for the S-Bahn, as long as you use it within two hours of your purchase. Tickets are also available at multilingual ticket machines on platforms or at sales points in major stations.<br><br>How to Buy a Ticket<br><br>Unlike the “Tube” in London, the Metro in Paris, BART in San Francisco, or urban rail systems in most world cities, you won’t encounter any turnstiles on the S- or U-Bahn in Germany. You don’t have to feed your ticket into a machine in order to get to your train.<br><br>You thus may be tempted to skip buying a ticket, but Germany’s “honor system” for public transport operates on the “trust but verify” principle. You never know when plain-clothes controllers will suddenly flash their badges and say the dreaded words: “Fahrkarten bitte!” (“Tickets please!”) If you get caught without a valid (stamped) ticket or pass, you’ll have to pay a fine on the spot – tourists included! The fine went up in spring 2015 from €40 to €60 (about $68 USD). Since the typical one-way fare is about €2.80, it’s really not worth the embarassment, let alone the fine.<br><br>Where to Buy a Ticket<br><br>Most people buy a ticket from a ticket machine (Fahrkarten-/Ticketautomat), but in Berlin and some other cities you can also purchase a normal, season, or special ticket from a ticket office during normal business hours. “Customer Centre” ticket offices are located in larger stations and at BVG’s headquarters on Holzmarktstraße. Tickets are also available online and via a smartphone app (see below). You usually need to know which zone(s) you’ll be traveling in. See more about zones and special tickets below.<br><br><a href='https://www.german-way.com/travel-and-tourism/public-transport-in-germany/'>Source: Germanway.com</a>",
           "costOfLiving": "It costs around €1,100 a month to live in Germany, which takes into consideration rent, bills and living expenses for a one bedroom flat in a main city centre. However, these living expenses widely depend on the location you choose to live in and the lifestyle that you choose to have. As with any country there are wide discrepancies in costs between living in popular or very expensive cities and cheaper alternatives.<br><br>Numbeo and have discovered that overall living costs in Germany are as a general rule 1.57% lower in Germany than they are in the UK. Although there are a number of stats that bring the cost of living in Germany closer to those of living in the UK, some key figures such as the average cost of rent being 15.76% lower in Germany and other costs such as restaurant prices being 15.41% lower lead to Germany being a reasonably more affordable country to live in than the UK.",
           "whyStudyInThisCountry": "Germany (German: Deutschland German pronunciation: [ˈdɔʏtʃlant]), officially the Federal Republic of Germany (German: Bundesrepublik Deutschland, About this soundlisten (help·info)),[e] is a country in Central and Western Europe, lying between the Baltic and North Seas to the north, and the Alps to the south. It borders Denmark to the north, Poland and the Czech Republic to the east, Austria and Switzerland to the south, and France, Luxembourg, Belgium and the Netherlands to the west. Germany includes 16 constituent states, covers an area of 357,386 square kilometres (137,988 sq mi),and has a largely temperate seasonal climate. With nearly 83 million inhabitants, it is the second most populous state of Europe after Russia, the most populous state lying entirely in Europe, as well as the most populous member state of the European Union. Germany is a very decentralized country. Its capital and largest metropolis is Berlin, while Frankfurt serves as its financial capital and has the country's busiest airport. Germany's largest urban area is the Ruhr, with its main centres of Dortmund and Essen. The country's other major cities are Hamburg, Munich, Cologne, Stuttgart, Düsseldorf, Leipzig, Dresden, Bremen, Hannover, and Nuremberg.<br><br>Various Germanic tribes have inhabited the northern parts of modern Germany since classical antiquity. A region named Germania was documented before 100 AD. During the Migration Period, the Germanic tribes expanded southward. Beginning in the 10th century, German territories formed a central part of the Holy Roman Empire.During the 16th century, northern German regions became the centre of the Protestant Reformation. After the collapse of the Holy Roman Empire, the German Confederation was formed in 1815. The German revolutions of 1848–49 resulted in the Frankfurt Parliament establishing major democratic rights.<br><br>In 1871, Germany became a nation state when most of the German states (most notably excluding Switzerland and Austria) unified into the Prussian-dominated German Empire. After World War I and the revolution of 1918–19, the Empire was replaced by the parliamentary Weimar Republic. The Nazi seizure of power in 1933 led to the establishment of a dictatorship, World War II and the Holocaust. After the end of World War II in Europe and a period of Allied occupation, two German states were founded: West Germany, formed from the American, British, and French occupation zones, and East Germany, formed from the Soviet occupation zone. Following the Revolutions of 1989 that ended communist rule in Central and Eastern Europe, the country was reunified on 3 October 1990.<br><br>Today, the sovereign state of Germany is a federal parliamentary republic led by a chancellor. It is a great power with a strong economy; it has the world's fourth-largest economy by nominal GDP, and the fifth-largest by PPP. As a global leader in several industrial and technological sectors, it is both the world's third-largest exporter and importer of goods. A developed country with a very high standard of living, it upholds a social security and universal health care system, environmental protection, and a tuition-free university education.<br><br>The Federal Republic of Germany was a founding member of the European Economic Community in 1957 and the European Union in 1993. It is part of the Schengen Area and became a co-founder of the Eurozone in 1999. Germany is a member of the United Nations, NATO, the G7, the G20, and the OECD. Known for its rich cultural history, Germany has been continuously the home of influential and successful artists, philosophers, musicians, film people, sportspeople, entrepreneurs, scientists, engineers, and inventors. Germany has a large number of World Heritage sites and is among the top tourism destinations in the world.<br><br><a href='https://en.wikipedia.org/wiki/Germany'>Source: Wikipedia</a>"}
           },
           {
              "countryID":3,    
              "countryName":"Poland",
              "embassyEmail":"press@msz.gov.pl",
              "countryPhone":"+48 22 523 90 00",
              "visaRequirements":"The two main documents you will need to enter Poland if you are not an EU citizen are a valid travel document (passport) and a visa (if required).<br><br>Visa<br><br>As a general rule you need a visa to enter Poland. There are, however, a number of countries that are free of this requirement. You can check if your country is on the list here: http://www.msz.gov.pl<br><br>Poland is a part of the Schengen zone, so you can apply for a Polish visa and travel all around Europe (excluding the United Kingdom, Ireland, Cyprus, Bulgaria, Romania, Croatia and states outside of the EU).<br><br>There are several types of visas to choose from:<br><br>“D” type – a long-term national visa issued for up to one year allowing travel around the Schengen area for up to 90 days in a 180 days period A visa can only be extended in exceptional situations. Should you need to stay in Poland longer than specified in your visa please do apply for the temporary residence permit (see below)<br><br>5 easy steps to get a visa1) Find a Polish consulate that can process you application. You can use the MFA’s search engine http://mfa.gov.pl<br><br>2) Read carefully ALL the information concerning visa application on the consulate’s website and follow ALL the instructions.<br><br>3) Set a visa appointment with the consulate. In most cases you will have to register through our app<br><br>4) Prepare the necessary documents, including: application form, travel document (passport), biometric photo, health insurance, sufficient means to support yourself, documents confirming the purpose of your stay. The specifics of the required documentation may vary among consulates, so confirm them with the consulate’s website.<br><br>5) Submit all the documents including a printed and signed application form and the visa fee. Your visa application is complete. It will take up to 15 days for it to be reviewed.",
              "embassyWebsite":"http://www.msz.gov.pl",
              "embassyBookingPortal":"http://www.e-konsulat.gov.pl",
              "embassyButtonText":"Complete Appointment",
              "countryPicture": "images/universities-in-poland.png",
              "countryIcon": "images/poland.png",
              "countryVideo": "https://www.youtube.com/embed/1DSoxPKhl48",
              "whyThisCountry":{
              "transportInfo": "Bus, Tram & Trolleybus<br><br>Polish cities offer excellent public transport. Every large and medium-sized city will have a comprehensive autobus (bus) network, while some cities will also have tramwaj (tram) and trolejbus (trolleybus) systems. Warsaw is the only city with a metro.<br><br>Public transport normally operates daily from around 5am to 11pm. Service is less frequent on weekends.<br><br>Trams and buses are likely to be crowded during rush hour (7am to 9am and 4.30pm to 6.30pm Monday to Friday).<br><br>Timetables are usually posted at stops, but don’t rely too much on their accuracy.<br><br>Tickets & Fares<br><br>Each city has a slightly different system of ticketing and fares, so be prepared to watch what the locals do and do likewise.<br><br>Most cities have a fare system based on the duration of the ride, with a standard 60-minute ticket costing around 3zł. There may be slightly cheaper tickets available for shorter rides (20 or 30 minutes) and more expensive tickets for longer ones (90 minutes).<br><br>There are many common features across Polish buses and trams.<br><br>In most cities you can buy tickets from machines inside buses and trams (automat biletów) using a contactless card payment. You don't get a paper ticket; if an inspector asks, allow them to scan the card you used for payment.<br><br>There are also ticket machines on the street at major bus and tram stops. These accept cash (coins and notes) as well as cards, and issue paper tickets.<br><br>You can also buy paper tickets from newspaper kiosks like Ruch or Relay or from street stalls around the central stops.<br>Paper tickets should be validated in one of the little machines installed near the doors when you enter the bus or tram.<br>Plain-clothed ticket inspectors are always on the prowl and foreigners are not exempt.<br><br>Taxi<br>Taxis are widely available and not too expensive. Daytime fares are generally based on 6zł flagfall and 2.20zł per km. Prices are higher at night (10pm to 6am), on Sunday and outside the city limits. The number of passengers (usually up to four) and the amount of luggage doesn’t affect the fare.<br><br>Avoid unmarked pirate taxis (called ‘mafia’ taxis by Poles), which usually have just a small ‘taxi’ sign on the roof with no name or phone number.You can flag down cabs on the street or order them by phone. It's best to order by phone if possible, as it cuts down the chance you'll get a rogue driver.<br><br>Remember to carry small denomination banknotes, so you’ll be able to pay the exact fare. If you don’t, it’s hard to get change from a driver who’s intent on charging you more.<br><br><a href='https://www.lonelyplanet.com/poland/transport/getting-around/local-transport'> Source: Lonley Planet</a>",
              "costOfLiving": "The cost of living in Poland is among the cheapest in the European Union (EU), alongside Romania and Bulgaria. In the 2018 Mercer Cost of Living Survey, Warsaw, Poland's most expensive city, ranked 154 out of 209 cities.<br><br>Overall, Poland has a moderate cost of living index, with the larger cities being significantly more expensive than the rural areas, as is the case with most countries.<br><br>Accommodation costs in Poland<brThe cost of accommodation in Poland varies, but apartments closest to the main square in any Polish city – big or small – will usually be the most expensive. Expats who are willing to live a bit further out and manage a small commute will find better deals for apartments with larger living spaces.<br><br>Food costs in Poland<br>Eating out and buying groceries is generally cheaper than in most other Western European cities and prices for Polish products are very reasonable, but imported items will be significantly more expensive.<br><br>Cost of transport in Poland<br>Public transportation is relatively inexpensive and students, pupils and senior citizens are eligible for discounts on long-term ticketing.Poland's central location and the prevalence of low-cost air travel makes it easy and affordable to explore the rest of Europe while living in Poland. Airports can be found in all of the major Polish cities.<br><br>Cost of education in Poland<br>Public education in Poland is free but it is not a viable option for many expats as the language of instruction is Polish.Most often, expat parents send their child to an international school where the students can continue to follow the same curriculum that they were studying from in their home country. Most international schools are found in Warsaw or Krakow. International school fees can prove to be a huge expense as fees are high, as are additional expenses such as the cost of school trips, uniforms and textbooks.<br><br>Accommodation (monthly rent)<br>One-bedroom apartment in the city centre: PLN 3,500<br><br>Three-bedroom apartment in the city centre:PLN 6,700<br><br>One-bedroom apartment outside of the city centre:PLN 2,800<br><br>Three-bedroom apartment outside of the city centre:PLN 5,000<br><br>Shopping<br>Dozen eggs:PLN 9<br><br>Milk (1 litre):PLN 3<br><br>Rice (1 kg):PLN 4.50<br><br>Loaf of white bread:PLN 3.50<br><br>Chicken breasts (1kg):PLN 19<br><br>Pack of cigarettes (Marlboro):<br><br>PLN 16",
              "whyStudyInThisCountry": "Poland (Polish: Polska [ˈpɔlska]), officially the Republic of Poland (Polish: Rzeczpospolita Polska[c] [ʐɛt͡ʂpɔˈspɔlita ˈpɔlska] (About this soundlisten)), is a country located in Central Europe.It is divided into 16 administrative subdivisions, covering an area of 312,696 square kilometres (120,733 sq mi), and has a largely temperate seasonal climate.[8] With a population of approximately 38.5 million people, Poland is the sixth most populous member state of the European Union.[8] Poland's capital and largest metropolis is Warsaw. Other major cities include Kraków, Łódź, Wrocław, Poznań, Gdańsk and Szczecin.<br><br>Poland is bordered by the Baltic Sea, Russian Kaliningrad Oblast and Lithuania to the north, Belarus and Ukraine to the east, Slovakia and Czech Republic to the south and Germany to the west.<br><br>The establishment of the Polish state can be traced back to A.D. 966, when Mieszko I,ruler of the realm coextensive with the territory of present-day Poland, converted to Christianity. The Kingdom of Poland was founded in 1025, and in 1569 it cemented its longstanding political association with the Grand Duchy of Lithuania by signing the Union of Lublin. This union formed the Polish–Lithuanian Commonwealth, one of the largest (about 1 million km2) and most populous countries of 16th- and 17th-century Europe, with a uniquely liberal political system which adopted Europe's first written national constitution, the Constitution of 3 May 1791.<br><br>More than a century after the Partitions of Poland at the end of the 18th century, Poland regained its independence in 1918 with the Treaty of Versailles. In September 1939, World War II started with the invasion of Poland by Germany, followed by the Soviet Union invading Poland in accordance with the Molotov–Ribbentrop Pact. More than six million Polish citizens perished in the war.In 1947, the Polish People's Republic was established as a satellite state under Soviet influence.In the aftermath of the Revolutions of 1989, most notably through the emergence of the Solidarity movement, the sovereign state of Poland reestablished itself as a presidential democratic republic.<br><br>Poland is a developed market and regional power. It has the eighth largest and one of the most dynamic economies in the European Union,simultaneously achieving a very high rank on the Human Development Index.Additionally, the Polish Stock Exchange in Warsaw is the largest and most important in Central Europe.Poland is a developed country,which maintains a high-income economy along with very high standards of living, life quality,safety, education and economic freedom.Poland has a developed school educational system. The country provides free university education, state-funded social security and a universal health care system for all citizens.Poland has 15 UNESCO World Heritage Sites, 14 of which are cultural.[31] Poland is a member state of the European Union, the Schengen Area, the United Nations, NATO, the OECD, the Three Seas Initiative, and the Visegrád Group. <br><br><a href='https://en.wikipedia.org/wiki/Poland'>Source: Wikipedia</a>"}
              }
    ] 
   }; //End Data

    function universityContactInfo (uvrstynm,defaultapplicationportal,defaultappemailaddress){
        var len = dataUniversity.universitiesinfo.length;
        for (var i = 0; i < len; i++){
            if(uvrstynm === dataUniversity.universitiesinfo[i].universityname){
                var row = dataUniversity.universitiesinfo[i];
                var applicationportal = row.application_url;
                var universityemail = row.email;
            }
        }
        
        if (!applicationportal){
            var applicationportal = defaultapplicationportal;
        } else if(!universityemail){
           universityemail = defaultappemailaddress;
        }
        
        var universityContactInfo = ({
            "applicationportal" :applicationportal,
            "universityemail" :universityemail
        }); 
        return universityContactInfo;     
    }

    function getcountriesInfoProperties (nameOfTheCountry,res,pageview){
            var len = dataCountries.countriesinfo.length;
            for (var i = 0; i < len; i++){
                if(nameOfTheCountry === dataCountries.countriesinfo[i].countryName){
                    var row = dataCountries.countriesinfo[i];
                }
            }           

        if (pageview == "visapage"){
            return row;          
        }

            var countriesContactInfo = ({
                "countryID":row.countryID,    
                "countryName":row.countryName,
                "embassyEmail":row.embassyEmail,
                "countryPhone":row.countryPhone,
                "visaRequirements":row.visaRequirements,
                "embassyWebsite":row.embassyWebsite,
                "embassyBookingPortal":row.embassyBookingPortal,
                "transportInfo": row.whyThisCountry.transportInfo,
                "costOfLiving": row.whyThisCountry.costOfLiving,
                "whyStudyInThisCountry": row.whyThisCountry.whyStudyInThisCountry,
                "embassyButtonText": row.embassyButtonText,
                "countryPicture": row.countryPicture,
                "countryVideo": row.countryVideo,
                "countryIcon": row.countryIcon,
            }); 
            res.json(countriesContactInfo); 
                
    }


    function switchApps(req, runmode) {
        var recievedInfo = recievedProperties(req);
        //IF Studyinbudapest then
        if (recievedInfo.appversion == "studyinbudapest") {

            var emailProperties = studyInBudapestProperties();

            if (runmode == "dev") {
                var recruitmentSite = emailProperties.localhostrecruitsite;
            } else if (runmode == "demo") {
                var recruitmentSite = emailProperties.demoVersionrecruitmentSite;
            } else if (runmode == "prod") {
                var recruitmentSite = emailProperties.recruitmentSite;
            }
        }

        //IF Studyineurope then
        if (recievedInfo.appversion == "studyineurope") {
            var emailProperties = studyInEuropeProperties();
            if (runmode == "dev") {
                var recruitmentSite = emailProperties.localhostrecruitsite;
            } else if (runmode == "prod") {
                var recruitmentSite = emailProperties.recruitmentSite;
            } else if (runmode == "demo") {
                var recruitmentSite = emailProperties.demoVersionrecruitmentSite;
            }
        }

        //IF Travel Admission then
        if (recievedInfo.appversion == "traveladmission") {

            var emailProperties = travelAdmissionProperties();

            if (runmode == "dev") {
                var recruitmentSite = emailProperties.localhostrecruitsite;
            } else if (runmode == "prod") {
                var recruitmentSite = emailProperties.recruitmentSite;
            } else if (runmode == "demo") {
                var recruitmentSite = emailProperties.demoVersionrecruitmentSite;
            }
        }

        var switchAppproperties = ({
            "emailProperties": emailProperties,
            "recievedInfo": recievedInfo,
            "recruitmentSite": recruitmentSite
        });

        return switchAppproperties;
    }

    function logMailErrorOrSendOk(error, res) {
        if (error) {
            return console.log(error);
        } else {
            res.sendStatus(200);
        }
    }

function sendEmailTransporter(fromInfo, toInfo, subjectInfo, textInfo, htmlInfo,emailTransporter){

    var emailInfo = {
        from: fromInfo, // sender address
        to: toInfo, // list of receivers
        subject: subjectInfo,
        text: textInfo, // plain text body
        html: htmlInfo
    };
    emailTransporter.sendMail(emailInfo, (error, info) => {
        if (error) {
            //res.sendStatus(500);
            return console.log(error);
        } else {
            res.sendStatus(200);
        }
    });

     };

    //Logout Universities
    goziextech.get('/logout', function (req, res, next) {
        req.logout();
        res.redirect('/');

        //res.json(user);
    });


    goziextech.post('/appuniversities', function (req, res, next) {
        var universityid = req.body.id;
        var view = req.body.view;
        var data = dataUniversity;
        /*********** Send Universities*************/
        if (view == "universitiespage") {
            //Send Only University  
            res.json(data.universitiesinfo); //All universities    
        }
        /*********** END *************/

        /*********** Send Courses *************/
        if (view == "coursespage") {
            //console.log("Recieved request to send courses");   
            //Send Only Courses of the exact University  
            for (var all = 0; all < data.universitiesinfo.length; all++) {
                var universitydata = data.universitiesinfo[all];
                var universitydataid = universitydata.id;
                if (universityid == universitydataid) {
                    var universityCoursesInfo = universitydata;
                }
            }
            res.json(universityCoursesInfo);
        }

        /*********** END *************/

        /*********** Send Courses *************/
        if (view == "scholarshipspage") {
            /*console.log("Recieved request to send scholarship");*/
            //Send Only Courses of the exact University  
            for (var all = 0; all < data.universitiesinfo.length; all++) {
                var universitydata = data.universitiesinfo[all];
                var universitydataid = universitydata.id;
                if (universityid == universitydataid) {
                    var universityCoursesInfo = universitydata;
                }
            }
            res.json(universityCoursesInfo);
        }

        /*********** END *************/


        /*********** Send University *************/
        if (view == "universitydescription") {
            //console.log("Recieved request to send university"); 
            //Send exact University  
            for (var all = 0; all < data.universitiesinfo.length; all++) {
                var universitydata = data.universitiesinfo[all];
                var universitydataid = universitydata.id;
                if (universityid == universitydataid) {
                    var universityInfo = universitydata;
                }
            }
            res.json(universityInfo);
        }

        /*********** END *************/



        if (view == "coursebyID") {
            //console.log("Recieved request to send courseByID");  
            var courseid = req.body.courseid;
            for (var i = 0; i < data.universitiesinfo.length; i++) {
                var universitydata = data.universitiesinfo[i];
                var universitydataid = universitydata.id;
                //If ID Match    
                if (universityid == universitydataid) {
                    var universityDataByID = universitydata;
                    var universityApplicationID = universityDataByID.id;
                    var universityCourses = universitydata.courses;
                    for (var x = 0; x < universityCourses.length; x++) {

                        var courses = universityCourses[x];
                        var universityCourseByID = courses.courseID;
                        if (courseid == universityCourseByID) {
                            var course = courses;
                        } //End If
                    } //End For Loop

                } //End IF
            } //End For Loopp
            res.json(course);
        } //End IF  


        if (view == "scholarshipbyID") {
            //console.log("Recieved request to send scholarshipByID");  
            var scholarshipid = req.body.scholarshipid;
            for (var i = 0; i < data.universitiesinfo.length; i++) {
                var universitydata = data.universitiesinfo[i];
                var universitydataid = universitydata.id;
                //If ID Match    
                if (universityid == universitydataid) {
                    var universityDataByID = universitydata;
                    var universityApplicationID = universityDataByID.id;
                    var universityScholarships = universitydata.scholarships;
                    for (var x = 0; x < universityScholarships.length; x++) {

                        var scholarships = universityScholarships[x];
                        var universityScholarshipByID = scholarships.scholarshipID;
                        if (scholarshipid == universityScholarshipByID) {
                            var scholarship = scholarships;
                        } //End If
                    } //End For Loop

                } //End IF
            } //End For Loopp
            res.json(scholarship);
        } //End IF  


    });

    goziextech.post('/countries',function(req, res, next){
    var runmode = recievedProperties.runmode;    
    var selectAppType = switchApps(req, runmode);    
    var nameOfTheCountry = selectAppType.recievedInfo.recievedData.nameOfTheCountry;
    var pageview = "otherpages";  
    getcountriesInfoProperties(nameOfTheCountry,res,pageview);
    });

    goziextech.post('/allcountries',function(req, res, next){
        res.json(dataCountries.countriesinfo);
        });
    

    goziextech.post('/authentication', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        res.send(req.user);
    });

     /********** Students Endpoints ***************/

    goziextech.post('/allstudents', ensurePostPutDeleteIsAuthorized, function (req, res, next) {
        Students.getStudents(function (err, students) {
            logError(err);
            res.json(students);
        });
    });

    //Post student details and ensureAuthenticated
    goziextech.post('/students', ensurePostPutDeleteIsAuthorized, function (req, res, next) {
        var runmode = recievedProperties.runmode;
        var selectAppType = switchApps(req, runmode);
        var uniContactInfo = universityContactInfo (selectAppType.recievedInfo.uvrstynm,selectAppType.emailProperties.applicationportal,selectAppType.emailProperties.admissionOfficeEmail);

        Students.addStudent(selectAppType.recievedInfo.recievedData, function (err, replied) {
            logError(err); //IF error
            sendReplyAsOk(replied, res); //If reply is Ok   
        });

        //Notify Student that Application has been recieved
        let applicationRecievedMail = {
            from: selectAppType.emailProperties.admissionOfficeEmail,
            to: selectAppType.recievedInfo.stdnteml,
            subject: selectAppType.recievedInfo.stdntfnmae + ' you started a new application ' + selectAppType.recievedInfo.uvrstynm,
            text: 'Please view this email as HTML,Application Recieved',
            html: '<body style="margin:0px; background: #f8f8f8;"><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="' + selectAppType.emailProperties.signOffLogo + '" alt="' + selectAppType.emailProperties.signOffName + '" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>' + selectAppType.recievedInfo.stdntfnmae + '</b><p> Your application to study <b>' + selectAppType.recievedInfo.course + '</b> at <b>' + selectAppType.recievedInfo.uvrstynm + '</b> has been processed by our app, however to complete your application, please make sure that you complete the university registration form as well, if you do not complete the registration form on the university website or portal, your application will not be processed by the university, if you skipped this step or abandoned the university form on their website, you can continue here</p><center><a href="' + uniContactInfo.applicationportal + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Continue </a></center><p>If you will like to ask a question from the university, you can contact the university with a click away</p><center><a href="mailto:' + uniContactInfo.universityemail + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #32CD32; border-radius: 60px; text-decoration:none;"> Message </a></center><p>' + selectAppType.emailProperties.signOffName + ' connects you with universities and makes it easy for you to apply for admission to one university and get recruited by multiple universities, travel, visa, and city guide in one app.</p><b>- Thanks ' + selectAppType.emailProperties.signOffName + '</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration:underline;">Unsubscribe</a> </p></div></div></div></body>'
        };

        if(selectAppType.recievedInfo.recievedData.applicationMode == "applyBeforePay"){
          //console.log("Payment mode, therefore no need to send an email to student until after payment is confirmed");
        } else {
            selectAppType.emailProperties.emailsender.sendMail(applicationRecievedMail, (error, info) => {
                logMailErrorOrSendOk(error, res);
            });
        }

        //SIB notify mail
        let NotifySibMail = {
            from: selectAppType.emailProperties.admissionOfficeEmail,
            to: preferedRecivingEmail,
            subject: selectAppType.recievedInfo.stdntfnmae + ' ' + selectAppType.recievedInfo.stdntlname + ' Applied to ' + selectAppType.recievedInfo.uvrstynm,
            text: 'Please view this email as HTML',
            html: '<body style="margin:0px; background: #f8f8f8;"><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="' + selectAppType.recruitmentSite + '" target="_blank"><img src="' + selectAppType.emailProperties.signOffLogo + '" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>' + selectAppType.recievedInfo.stdntfnmae + '</b><p> Started an application to study <b>' + selectAppType.recievedInfo.course + '</b> at <b>' + selectAppType.recievedInfo.uvrstynm + '</b> you can check the status of the university website here </p><center><a href="' + uniContactInfo.applicationportal + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> University Website </a></center><p>If you will like to ask a question from the student, you can send a message to ' + selectAppType.recievedInfo.stdnteml + ' or if you need assistance from the university to answer any student question, you can contact the university using the the email address: ' + uniContactInfo.universityemail + '</p><center><a href="mailto:' + selectAppType.recievedInfo.stdnteml + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #32CD32; border-radius: 60px; text-decoration:none;"> Message </a></center><p>' + selectAppType.emailProperties.signOffName + ' connects you with universities and makes it easy for you to apply for admission to one university and get recruited by multiple universities, travel, visa, and city guide in one app.</p><b>- Thanks ' + selectAppType.emailProperties.signOffName + '</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration:underline;">Unsubscribe</a> </p></div></div></div></body>'
        };

        selectAppType.emailProperties.emailsender.sendMail(NotifySibMail, (error, info) => {
            logMailErrorOrSendOk(error, res);
        });

        //Note if email is not sending maybe a university has turned it off        
        //Get All Universities and notify them
        Universities.getUniversities(function (err, universitiesmailinfo) {
            logError(err)
            if (universitiesmailinfo) {
                for (var i = 0; i < universitiesmailinfo.length; i++) {
                    //console.log("emails:" + universitiesmailinfo[i].email);
                    var eachuniversityemail = universitiesmailinfo[i].email;
                    var eachuniversityname = universitiesmailinfo[i].university;
                    var eachuniversityid = universitiesmailinfo[i]._id;
                    var eachuniversitynotificationstatus = universitiesmailinfo[i].notification;
                    //University notify mail
                    if (eachuniversitynotificationstatus == "on") {

                        let UniversitiesNotifyMail = {
                            from: selectAppType.emailProperties.admissionOfficeEmail,
                            to: eachuniversityemail,
                            subject: 'New Application Recieved - Recruit Now',
                            text: 'Please view this email as HTML,Application Recieved',
                            html: '<body style="margin:0px; background: #f8f8f8;"><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="' + selectAppType.recruitmentSite + '" target="_blank"><img src="' + selectAppType.emailProperties.signOffLogo + '" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>Hi ' + eachuniversityname + ',</b><p><b>' + selectAppType.recievedInfo.stdntfnmae + ' ' + selectAppType.recievedInfo.stdntlname + '</b> from <b>' + selectAppType.recievedInfo.stdntcountry + '</b> has just started an application to study <b>' + selectAppType.recievedInfo.course + '</b> at <b>' + selectAppType.recievedInfo.uvrstynm + '</b> if you offer <b>' + selectAppType.recievedInfo.course + '</b> at <b>' + eachuniversityname + '</b> then this is a great oppurtunity to hurry up and be the first to recruit this student for free </p><center><a href="' + selectAppType.recruitmentSite + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;">Recruit Student</a></center><p>If you will like to ask a question from<b> ' + selectAppType.recievedInfo.stdntfnmae + ' ' + selectAppType.recievedInfo.stdntlname + '</b>, you can also send a message to<b> ' + selectAppType.recievedInfo.stdntfnmae + ' ' + selectAppType.recievedInfo.stdntlname + '</b></p><center><a href="' + selectAppType.recruitmentSite + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #32CD32; border-radius: 60px; text-decoration:none;"> Send Message </a></center><p>Other universities in your region use ' + selectAppType.emailProperties.signOffName + ' and they can see <b>' + selectAppType.recievedInfo.stdntfnmae + ' ' + selectAppType.recievedInfo.stdntlname + '</b> application</p><b>- Thanks ' + selectAppType.emailProperties.signOffName + '</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="' + selectAppType.recruitmentSite + '#/email/unsubscribe/' + eachuniversityemail + '/' + eachuniversityid + '" style="color: #b2b2b5; text-decoration:underline;">Turn off Notifications</a> </p></div></div></div></body>'
                        };

                        selectAppType.emailProperties.emailsender.sendMail(UniversitiesNotifyMail, (error, info) => {
                            logMailErrorOrSendOk(error,res);
                        });
                    } //If notification field is switched on 
                } //End For Loop       

            } //End Else
        });

    });

    //Get Student by ID
    goziextech.post('/profile/students/:_id', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        Students.getStudentsById(req.params._id, function (err, student) {
            logError(err);
            res.json(student);
        });
    });

    //Get Student by ID // Duplicated to change get to post to be able to ensure authenticate and ensure post put deleted is secured
    goziextech.post('/student/:_id', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        Students.getStudentsById(req.params._id, function (err, student) {
            logError(err);
            res.json(student);
        });
    });


    //Apply Mail Payment Mode (Rewrite using a colum to validate which email to send at /students)
    goziextech.post('/applymail', ensurePostPutDeleteIsAuthorized, function (req, res, next) {

        var runmode = recievedProperties.apprunmode;
        var selectAppType = switchApps(req, runmode);
        var uniContactInfo = universityContactInfo (selectAppType.recievedInfo.uvrstynm,selectAppType.emailProperties.applicationportal,selectAppType.emailProperties.admissionOfficeEmail);

        //Apply mail
        let applyMail = {
            from: selectAppType.emailProperties.admissionOfficeEmail, // sender address
            to: selectAppType.recievedInfo.stdnteml, // list of receivers
            subject: selectAppType.recievedInfo.stdntfnmae + ' you started a new application ' + selectAppType.recievedInfo.uvrstynm,
            text: 'Please view this email as HTML,Application Recieved', // plain text body
            html: '<body style="margin:0px; background: #f8f8f8;"><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>' + selectAppType.recievedInfo.stdntfnmae + '</b><p> Your application to study <b>' + selectAppType.recievedInfo.course + '</b> at <b>' + selectAppType.recievedInfo.uvrstynm + '</b> has been processed by our app, however to complete your application, please make sure that you complete the university registration form as well, if you do not complete the registration form on the university website or portal, your application will not be processed by the university, if you skipped this step or abandoned the university form on their website, you can continue here</p><center><a href="' + uniContactInfo.applicationportal + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Continue </a></center><p>If you will like to ask a question from the university, you can contact the university with a click away</p><center><a href="mailto:' + uniContactInfo.universityemail + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #32CD32; border-radius: 60px; text-decoration:none;"> Message </a></center><p>Study in Budapest connects you with universities and makes it easy for you to apply for admission to one university and get recruited by multiple universities, travel, visa, and city guide in one app.</p><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration:underline;">Unsubscribe</a> </p></div></div></div></body>'
        };

        //SIB notify mail
        let paymentNotifyMail = {
            from: selectAppType.emailProperties.admissionOfficeEmail, // sender address
            to: preferedRecivingEmail, // list of receivers
            subject: 'Payment Recieved: ' + selectAppType.recievedInfo.stdntfnmae + ' ' + selectAppType.recievedInfo.stdntlname + ' Has Payed for ' + selectAppType.recievedInfo.uvrstynm,
            text: 'Please view this email as HTML,Payment Recieved', // plain text body
            html: '<body style="margin:0px; background: #f8f8f8;"><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><p><b>' + selectAppType.recievedInfo.stdntfnmae + ' ' + selectAppType.recievedInfo.stdntlname + '</b> has completed payment for processing fee to start application to study <b>' + selectAppType.recievedInfo.course + '</b> at <b>' + selectAppType.recievedInfo.uvrstynm + '</b> you can check the status of the university website here </p><center><a href="' + uniContactInfo.applicationportal + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> University Website </a></center><p>If you will like to ask a question from the student, you can send a message to ' + selectAppType.recievedInfo.stdnteml + '</p><center><a href="mailto:' + selectAppType.recievedInfo.stdnteml + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #32CD32; border-radius: 60px; text-decoration:none;"> Message </a></center><p>Study in Budapest connects you with universities and makes it easy for you to apply for admission to one university and get recruited by multiple universities, travel, visa, and city guide in one app.</p><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration:underline;">Unsubscribe</a> </p></div></div></div></body>'
        };

        // setup email data with unicode symbols
        let invoice = {
            from: selectAppType.emailProperties.admissionOfficeEmail, // sender address
            to: selectAppType.recievedInfo.stdnteml, // list of receivers
            subject: ' Payment Reciept',
            text: 'Please view this email as HTML,Your invoice is enclosed', // plain text body
            html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="background:#1e88e5; padding:20px; color:#fff; text-align:center;"> Goziex Technologies Limited </td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>' + selectAppType.recievedInfo.stdntfnmae + ' ' + selectAppType.recievedInfo.stdntlname + '</b><p style="margin-top:0px;">Invoice</p></td><td align="right" width="100"> ' + selectAppType.recievedInfo.date + '</td></tr><tr><td colspan="2" style="padding:20px 0; border-top:1px solid #f6f6f6;"><div><table width="100%" cellpadding="0" cellspacing="0"><tbody><tr><td style="font-family: "arial"; font-size: 14px; vertical-align: middle; margin: 0; padding: 9px 0;">' + selectAppType.recievedInfo.course + '</td><td style="font-family: "arial"; font-size: 14px; vertical-align: middle; margin: 0; padding: 9px 0;"  align="right">€ ' + selectAppType.recievedInfo.amount + '</td></tr><tr class="total"> <td style="font-family: "arial"; font-size: 14px; vertical-align: middle; border-top-width: 1px; border-top-color: #f6f6f6; border-top-style: solid; margin: 0; padding: 9px 0; font-weight:bold;" width="80%">Total</td><td style="font-family: "arial"; font-size: 14px; vertical-align: middle; border-top-width: 1px; border-top-color: #f6f6f6; border-top-style: solid; margin: 0; padding: 9px 0; font-weight:bold;" align="right">€ ' + selectAppType.recievedInfo.amount + '</td></tr></tbody></table></div></td></tr><tr><td colspan="2"><center></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited.<br> If you have any questions regarding this invoice please contact <a href="http://help.studyinbudapest.com">support<a/></p></div></div></div></body>'
        };

        res.sendStatus(200);

        // Invoice
        transporter.sendMail(invoice, (error, info) => {
            if (error) {
                //res.send(500);
                return console.log(error);
            } else {
                res.sendStatus(200);
            }
        });

        transporter.sendMail(applyMail, (error, info) => {
            if (error) {
                //res.send(500);
                return console.log(error);
            } else {
                res.sendStatus(200);
            }
        });

        transporter.sendMail(paymentNotifyMail, (error, info) => {
            if (error) {
                //res.send(500);
                return console.log(error);
            } else {
                res.sendStatus(200);
            }
        });
    });


    //Taxi Book A Ride
    goziextech.post('/ride', ensurePostPutDeleteIsAuthorized, function (req, res, next) {

        //Declare Variables
        var stdntfnmae = req.body.first_name;
        var stdntlname = req.body.last_name;
        var stdnteml = req.body.email;

        let taxiMail = {
            from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
            to: stdnteml, // list of receivers
            subject: stdntfnmae + ' you requested a ride',
            text: 'Please view this email as HTML,Your ride is on the way', // plain text body
            html: '<body style="margin:0px; background: #f8f8f8;"><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>' + stdntfnmae + '</b><p>We recieved your request for a ride, as soon as you complete your location and pick up details on the uber platform, Uber takes it up from there and we hope you enjoy your ride, however if you did not complete your booking with uber you can do it now </p><center><a href="https://m.uber.com/ul/?action=setPickup&client_id=VhepL7PPqkD2ClkUvOTgxb8_OJiexB6z&pickup=my_location&dropoff[formatted_address]=Budapest%2C%20Hungary&dropoff[latitude]=47.497912&dropoff[longitude]=19.040235" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Get your ride </a></center><p>Study in Budapest partners and leaverages Uber Technologies as one of the leading taxi technology company in the world and we believe in using technology to solve problems for international students.</p><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration:underline;">Unsubscribe</a> </p></div></div></div></body>'
        };


        transporter.sendMail(taxiMail, (error, info) => {
            if (error) {
                //res.send(500);
                return console.log(error);
            } else {
                res.sendStatus(200);
            }
        });


    });

    //Help Message
    goziextech.post('/help', ensurePostPutDeleteIsAuthorized, function (req, res, next) {
        var selectAppType = switchApps(req);

        let helpMail = {
            from: selectAppType.emailProperties.admissionOfficeEmail,
            to: selectAppType.recievedInfo.stdnteml, // list of receivers
            subject: selectAppType.recievedInfo.stdntfnmae + ' you asked for help!',
            text: 'Please view this email as HTML,You asked for help!', // plain text body
            html: '<body style="margin:0px; background: #f8f8f8;"><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="' + selectAppType.emailProperties.website+ '" target="_blank"><img src="' + selectAppType.emailProperties.signOffLogo + '" alt="' + selectAppType.emailProperties.signOffName + '" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>' + selectAppType.recievedInfo.stdntfnmae + '</b><p>Hang in there for a sec, a ' + selectAppType.emailProperties.signOffName + ' representative will provide answer to your question on <b>"' + selectAppType.recievedInfo.recievedData.message + '"</b><br> However, while you wait for quick help could you</p><center><a href="http://help.studyinbudapest.com" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Lookup Answers </a></center><p>If you need to speak to a representative , you can reach us at +1 (201) - 992- 1664</p><b>- Thanks ' + selectAppType.emailProperties.signOffName + '</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration:underline;">Unsubscribe</a> </p></div></div></div></body>'
        };

        let adminMail = {
            from: selectAppType.emailProperties.admissionOfficeEmail,
            to: preferedRecivingEmail,
            subject: selectAppType.recievedInfo.stdntfnmae + ' asked for help!',
            text: 'Please view this email as HTML,You asked for help!',
            html: '<body style="margin:0px; background: #f8f8f8;"><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="' + selectAppType.emailProperties.website+ '" target="_blank"><img src="' + selectAppType.emailProperties.signOffLogo + '" alt="' + selectAppType.emailProperties.signOffName + '" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><p><b>' + selectAppType.recievedInfo.stdntfnmae + '</b>' + " " + '<b>' + selectAppType.recievedInfo.stdntlname + '</b> Submitted a help request with the subject: <b>' + selectAppType.recievedInfo.recievedData.subject + '</b><br> and the following message: <b>"' + selectAppType.recievedInfo.recievedData.message + '"</b></p><center><a href="mailto:' + selectAppType.recievedInfo.stdnteml + '?subject=RE:' + selectAppType.recievedInfo.recievedData.subject + '&body=' + selectAppType.recievedInfo.recievedData.message + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Send Reply </a></center><p>If you need to lookup answers for the students, you can visit the <a href="http://help.studyinbudapest.com" target="_blank">help center</a></p><b>- Thanks ' + selectAppType.emailProperties.signOffName + '</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration:underline;">Unsubscribe</a> </p></div></div></div></body>'
        };

        res.sendStatus(200);
        selectAppType.emailProperties.emailsender.sendMail(helpMail, (error, info) => {
          logMailErrorOrSendOk(error,res);
        });

        selectAppType.emailProperties.emailsender.sendMail(adminMail, (error, info) => {
            logMailErrorOrSendOk(error,res);
        });
    });


//SAMIRCHANGES
//Handle Contact Message to Student
goziextech.post('/visa', ensurePostPutDeleteIsAuthorized, function (req, res, next) {
    var selectAppType = switchApps(req);
    var pageview = req.body.view;
    var country  = req.body.country;  // should embassy be added to recievedInfo????
    var embassyDetailsByCountry = getcountriesInfoProperties (country,res,pageview);
    var emailTransporter = selectAppType.emailProperties.emailsender;
  
    var subjectInfo = selectAppType.recievedInfo.stdntfnmae + ' ' + selectAppType.recievedInfo.stdntlname + ' Visa Appointment Confirmation!';
    var textInfo = 'Please view this email as HTML,Confirm your appointment!'; 
    var htmlInfo = '<body style="margin:0px; background: #f8f8f8;"><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="' + selectAppType.emailProperties.website + '" target="_blank"><img src="' + selectAppType.emailProperties.signOffLogo + '" alt="' + selectAppType.emailProperties.signOffName + '" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>' + selectAppType.recievedInfo.stdntfnmae + '</b><p>To complete your student visa interview booking for ' + country + ' simply use the following button:</p><center><a href="' + embassyDetailsByCountry.embassyBookingPortal+ ' " style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> ' + embassyDetailsByCountry.embassyButtonText + ' </a></center>   <br><center><a href="mailto:' + embassyDetailsByCountry.embassyEmail+ ' " style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Email Embassy </a></center><p>' + selectAppType.emailProperties.signOffName + ' connects you with universities and makes it easy for you to apply for admission to one university and get recruited by multiple universities, travel, visa, and city guide in one app.<br><br> If you need to speak to a representative , you can reach us at +1 (201) - 992- 1664</p><b>- Thanks ' + selectAppType.emailProperties.signOffName + '</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration:underline;">Unsubscribe</a> </p></div></div></div></body>';
    res.sendStatus(200);
    sendEmailTransporter(selectAppType.emailProperties.admissionOfficeEmail,selectAppType.recievedInfo.stdnteml,subjectInfo,
    textInfo,htmlInfo,emailTransporter);
});

//Handle Contact Message to Student
goziextech.post('/docucheck', ensurePostPutDeleteIsAuthorized, function (req, res, next) {
    var selectAppType = switchApps(req);
    var stdnteml = selectAppType.recievedInfo.stdnteml;
    var sibemail = preferedRecivingEmail;
    var senderEmail = selectAppType.emailProperties.admissionOfficeEmail;
    var subjectInfo = selectAppType.recievedInfo.stdntfnmae + ' You requested a document verification!';
    var NotifyLawyersubjectInfo = selectAppType.recievedInfo.stdntfnmae + ' requested a document verification!';
    var textInfo = 'Please view this email as HTML,Your requested a document verification!';

    var studentDocuCheckNotifyEmail = '<body style="margin:0px; background: #f8f8f8;"><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="' + selectAppType.emailProperties.website + '" target="_blank"><img src="' + selectAppType.emailProperties.signOffLogo + '" alt="' + selectAppType.emailProperties.appName + '" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>' + selectAppType.recievedInfo.stdntfnmae + '</b><p>We have received your visa eligibility check, our legal experts and professionals will have a look at your documents and send you an email on your eligibility and your chances of getting a student visa, if you will like to try your knowledge on questions the embassy may ask, you can use the visa section of our app </p><center><a href="' + selectAppType.emailProperties.appDownloadLink + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Take Practise Test </a></center><p>' + selectAppType.emailProperties.signOffName + ' connects you with universities and makes it easy for you to apply for admission to one university and get recruited by multiple universities, travel, visa, and city guide in one app.<br><br> If you need to speak to a representative , you can reach us at +1 (201) - 992- 1664</p><b>- Thanks ' + selectAppType.emailProperties.signOffName + '</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited</p></div></div></div></body>';

    var notifyLawyerEmail = '<body style="margin:0px; background: #f8f8f8;"><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="' + selectAppType.emailProperties.website + '" target="_blank"><img src="' + selectAppType.emailProperties.signOffLogo + '" alt="' + selectAppType.emailProperties.appName + '" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><p> <b>' + selectAppType.recievedInfo.stdntfnmae + '</b> needs a document check, you can respond to this students if you have legal expert or professionals knowledge if the documents uploaded are the right documents, you can have a look at the documents </p><center><a href="https://www.dropbox.com/sh/j1yf2l9ansaclxf/AADn5teKqXjjlbehZd6JsmXpa?dl=0" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Download Documents </a></center><br><center><a href="mailto:' + stdnteml + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: green; border-radius: 60px; text-decoration:none;"> Reply student</a></center><p>' + selectAppType.emailProperties.signOffName + ' connects you with universities and makes it easy for you to apply for admission to one university and get recruited by multiple universities, travel, visa, and city guide in one app.<br><br> If you need to speak to a representative , you can reach us at +1 (201) - 992- 1664</p><b>- Thanks ' + selectAppType.emailProperties.signOffName + '</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration:underline;">Unsubscribe</a> </p></div></div></div></body>'
    res.sendStatus(200);
    //send to student
    sendEmailTransporter(senderEmail,stdnteml,subjectInfo,textInfo,studentDocuCheckNotifyEmail,selectAppType.emailProperties.emailsender);
    //send to studyinbudapest officer or lawyer
    sendEmailTransporter(senderEmail,sibemail,NotifyLawyersubjectInfo,textInfo,notifyLawyerEmail,selectAppType.emailProperties.emailsender);
});

//SAMIRCHANGESFINISHED

    //Check Status
    goziextech.post('/checkstatus', ensurePostPutDeleteIsAuthorized, function (req, res, next) {
        var selectAppType = switchApps(req);
        var uniContactInfo = universityContactInfo (selectAppType.recievedInfo.uvrstynm,selectAppType.emailProperties.applicationportal,selectAppType.emailProperties.admissionOfficeEmail);
        //console.log(universityContactInfo.applicationportal);
        let statusMail = {
            from: selectAppType.emailProperties.admissionOfficeEmail,
            to: selectAppType.recievedInfo.stdnteml,
            subject: selectAppType.recievedInfo.stdntfnmae + ' continue your application to ' + selectAppType.recievedInfo.uvrstynm,
            text: 'Please view this email as HTML,Continue your application',
            html: '<body style="margin:0px; background: #f8f8f8;"><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="' + selectAppType.emailProperties.website + '" target="_blank"><img src="' + selectAppType.emailProperties.signOffLogo + '" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>' + selectAppType.recievedInfo.stdntfnmae + '</b><p> Here is how you can check the status of your application to study <b>' + selectAppType.recievedInfo.course + '</b> at <b>' + selectAppType.recievedInfo.uvrstynm + '</b>, you can email the university or click on the continue button, please make sure that you complete the university registration form as well, if you do not complete the registration form on the university website or portal, your application will not be completely processed by the university, if you skipped this step or abandoned the university form on their website, you can continue here</p><center><a href="' + uniContactInfo.applicationportal + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Continue Application</a></center><center><a href="mailto:' + uniContactInfo.universityemail + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #32CD32; border-radius: 60px; text-decoration:none;"> Email the university</a></center><p>' + selectAppType.emailProperties.signOffName + ' connects you with universities and makes it easy for you to apply for admission to one university and get recruited by multiple universities, travel, visa, and city guide in one app.</p><b>- Thanks ' + selectAppType.emailProperties.signOffName + '</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration:underline;">Unsubscribe</a> </p></div></div></div></body>'
        };
        res.sendStatus(200);
        transporter.sendMail(statusMail, (error, info) => {
            logMailErrorOrSendOk(error,res);
        });
    });

    //getStudentByEmail and Check for Existing User
    goziextech.post('/s/c', ensurePostPutDeleteIsAuthorized, function (req, res, next) {
        var email = req.body.email;
        Students.getStudentsByEmail(email, function (err, student) {
            logError(err);
            if (!student) {
                res.json({
                    status: "usernotfound"
                });
            } else {
                res.json(student);
            }
        });
    });



    /********** University Endpoints***************/

    //Get Universities
    goziextech.post('/admin/universities', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        Universities.getUniversities(function (err, universities) {
            logError(err);
            res.json(universities);
        });
    });

    //Get Universities
    goziextech.post('/alluniversities', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        Universities.getUniversities(function (err, universities) {
            logError(err);
            res.json(universities);
        });
    });

    //getUniversityByEmail and Check for Existing User
    goziextech.post('/u/c', ensurePostPutDeleteIsAuthorized, function (req, res, next) {
        var email = req.body.email;
        Universities.getUniversityByEmail(email, function (err, university) {
            logError(err);
            if (!university) {
                res.json({
                    status: "usernotfound"
                });
            } else {
                res.json(university);
            }
        });
    });

    

    //CheckStatusByEmail
    goziextech.post('/c/s', ensurePostPutDeleteIsAuthorized, function (req, res, next) {
        var email = req.body.email;
        Students.CheckStatusByEmail(email, function (err, student) {
            logError(err);
            if (!student) {
                res.json({
                    status: "usernotfound"
                });
            } else {
                res.json(student)
            }
        });
    });


    //Edit Number of Applied Students
    goziextech.put('/edit/universities/applied/:_id', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        var universityid = req.params._id;
        var numberofappliedstudents = req.body.number_of_students;
        Universities.updateNumberOfStudents(universityid, numberofappliedstudents, {}, function (err, replied) {
            logError(err);
            sendReplyAsOk(replied, res);
        });
    }); //End Edit   


    //Resend Verification Email
    goziextech.post('/resend/verifymail', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        var selectAppType = switchApps(req);
        //console.log("Goziex Tech App is running on the following mode: " + runmode);
        //console.log("The current recruitment site to be sent via email is : " + selectAppType.recruitmentSite);
        let verifyMailOptions = {
            from: selectAppType.emailProperties.admissionOfficeEmail,
            to: selectAppType.recievedInfo.recievedData.universityemail,
            subject: selectAppType.recievedInfo.recievedData.first_name + ' please verify your ' + selectAppType.recievedInfo.recievedData.university + ' email address',
            text: 'Please view this email as HTML,Verify your email address',
            html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><center><p>Please verify your email address to activate your account</p></center><center><a href="' + selectAppType.emailProperties.recruitmentSite + '#/verify/' + selectAppType.recievedInfo.recievedData.universityemail + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#00BF4B; border-radius: 60px; text-decoration:none;"> Verfiy your email</a></center><center><b>Are you ' + selectAppType.recievedInfo.recievedData.university + ' verification steps ?</b></center> As part of our data privacy and user protection, your account will need further verification to confirm if you are a university.<br> <br> <b>Step 1:</b> We will give your university a call on the number you provided on registration <br><b>Step 2:</b> We will send an email to your university admission email address to confirm if it is functional and truly owned by a university <br><br>   You can start using your account, as soon as we finish our verification, usually by phone or email.<br>Be sure, we will be in touch soon, In the mean time, should you have need to speak to us or if your information is taking longer than usual to be verified, please contact support: <b>1 (201) 992-1664 </b><center><a href="mailto:admissions@studyinbudapest.com" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#1e88e5; border-radius: 60px; text-decoration:none;"> Verification status</a><br></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration: underline;">Unsubscribe</a></p></div></div></div></body>'

        };
        res.sendStatus(200);
        selectAppType.emailProperties.emailsender.sendMail(verifyMailOptions, (error, info) => {
            logMailErrorOrSendOk(error, res);
        });
    }); //End Edit 

    //Create University
    goziextech.post('/universities', ensurePostPutDeleteIsAuthorized, function (req, res, next) {
        var university = req.body;
        Universities.addUniversity(university, function (err, createduniversity) {

            if (err) {
                return console.log(err);
            } else if (createduniversity) {

                //SIB notify mail
                let uniRegNotifyMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com>', // sender address
                    to: "admissions@studyinbudapest.com", // list of receivers
                    subject: createduniversity.university + ' has just registered on the app!',
                    text: 'Please view this email as HTML,Application Recieved', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8;"><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>Hi Goziex Tech</b><p><center>Here are the steps to check the authencity of the university, you can view the </p></center><center><a href="' + createduniversity.application_portal + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> University Website </a></center><br><center><p>You call the university using the number provided at registration , you can call ' + createduniversity.phone + '</p></center><center><a href="tel:' + createduniversity.phone + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Call University </a></center><center><p>If you will like to verify the university</p></center><center><a href="http://localhost:3000/#/activate/' + createduniversity.email + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #32CD32; border-radius: 60px; text-decoration:none;"> Activate Account </a></center><p>Study in Budapest connects international students with universities and makes it easy for students to apply for admission to one university and get recruited by multiple universities, travel, visa, and city guide in one app.</p><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration:underline;">Unsubscribe</a> </p></div></div></div></body>'
                };

                let UniveristyVerifyEmail = {

                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                    to: createduniversity.email, // list of receivers
                    subject: createduniversity.first_name + ' please verify your ' + createduniversity.university + ' email address',
                    text: 'Please view this email as HTML,Verify your email address', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><center><p>Please verify your email address to activate your account</p></center><center><a href="http://localhost:3000/#/verify/' + createduniversity.email + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#00BF4B; border-radius: 60px; text-decoration:none;"> Verfiy your email</a></center><center><b>Are you ' + createduniversity.university + ' verification steps ?</b></center> As part of our data privacy and user protection, your account will need further verification to confirm if you are a university.<br> <br> <b>Step 1:</b> We will give your university a call on the number you provided on registration <br><b>Step 2:</b> We will send an email to your university admission email address to confirm if it is functional and truly owned by a university <br><br>   You can start using your account, as soon as we finish our verification, usually by phone or email.<br>Be sure, we will be in touch soon, In the mean time, should you have need to speak to us or if your information is taking longer than usual to be verified, please contact support: <b>1 (201) 992-1664 </b><center><a href="mailto:admissions@studyinbudapest.com" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#1e88e5; border-radius: 60px; text-decoration:none;"> Check verification status</a><br></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration: underline;">Unsubscribe</a></p></div></div></div></body>'

                };


                let UniversityWelcomeEmail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                    to: createduniversity.email, // list of receivers
                    subject: createduniversity.first_name + ' Welcome to Study in Budapest',
                    text: 'Please view this email as HTML,Welcome to Studyinbudapest', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>' + createduniversity.first_name + ',</b><center><p>Welcome to Studyinbudapest meet your dashboard, your one stop recruitment easy to use tool, you can now start recruiting international students for free </p></center><center><p>Your username is: <strong>' + createduniversity.username + '</strong></p></center><center><img src="http://www.studyinbudapest.com/images/emailassets/university%20dasboard%202018.png" style="display:block; width:80%"></center><center><a href="http://localhost:3000" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> View Applicants </a></center><center><p>Every week international students are applying to other universities in your area and you can recruit them for FREE</p></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited </p></div></div></div></body>'

                };

                res.sendStatus(200);
                transporter.sendMail(UniversityWelcomeEmail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });
                transporter.sendMail(UniveristyVerifyEmail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });
                transporter.sendMail(uniRegNotifyMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

            }
        });
        /*
        if (createduniversity) {   
         res.json(createduniversity);    
         // Set 30 Days trial period    
         setTimeout(function(){
         //When Json is sent res ends
         Universities.deactivateTrial (createduniversity, function(err, deactivateduniversity){
          if (err){ return console.log(err);
         }     
           //res.json(deactivateduniversity); //Send back trial deactivation 
           //console.log(deactivateduniversity) 
         })

         }, 600000);    


        } // end else 
       */
    });

    //Edit University Profile
    goziextech.put('/edit/universities/:_id', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        var id = req.params._id;
        var universitydetails = req.body;
        //console.log(universitydetails);    
        var universityfirstname = universitydetails.first_name;
        var universitylastname = universitydetails.last_name;
        var universityemail = universitydetails.email;
        var applicationportal = universitydetails.application_portal;
        var password = universitydetails.password;
        var phonenumber = universitydetails.phone;
        var oldemail = universitydetails.oldemail;

        //First name
        if (universityfirstname) {
            //Update First Name    
            Universities.EditUniversityFirstName(id, universityfirstname, {}, function (err, university) {
                if (err) {
                    return console.log(err);
                }

                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>FIRST NAME</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited </p></div></div></div></body>'

                }

                res.sendStatus(200);

                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

            });

        }



        //IF Last Name
        if (universitylastname) {
            //Update Last Name    
            Universities.EditUniversityLastName(id, universitylastname, {}, function (err, university) {

                if (err) {
                    return console.log(err);
                }
                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>LAST NAME</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited</p></div></div></div></body>'

                }

                res.sendStatus(200);

                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }

                });

            });

        }

        //IF Email    
        if (universityemail) {
            //Update Email
            Universities.EditUniversityEmail(id, universityemail, {}, function (err, university) {
                if (err) {
                    return console.log(err);
                }

                //unverify    
                Universities.unVerifyUniversityEmail(id, {}, function (err, unverifieduniversity) {
                    if (err) {
                        return console.log(err);
                    }

                });
                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>EMAIL</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited</p></div></div></div></body>'

                }

                let verifyMailOptions = {

                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                    to: universityemail, // list of receivers
                    subject: university.first_name + ' please verify your ' + university.university + ' email address',
                    text: 'Please view this email as HTML,Verify your email address', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><center><p>Please verify your email address to activate your account</p></center><center><a href="http://localhost:3000/#/verify/' + universityemail + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#00BF4B; border-radius: 60px; text-decoration:none;"> Verfiy your email</a></center><center><b>Are you ' + university.university + ' verification steps ?</b></center> As part of our data privacy and user protection, your account will need further verification to confirm if you are a university.<br> <br> <b>Step 1:</b> We will give your university a call on the number you provided on registration <br><b>Step 2:</b> We will send an email to your university admission email address to confirm if it is functional and truly owned by a university <br><br>   You can start using your account, as soon as we finish our verification, usually by phone or email.<br>Be sure, we will be in touch soon, In the mean time, should you have need to speak to us or if your information is taking longer than usual to be verified, please contact support: <b>1 (201) 992-1664 </b><center><a href="mailto:admissions@studyinbudapest.com" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#1e88e5; border-radius: 60px; text-decoration:none;">Verification Status</a><br></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration: underline;">Unsubscribe</a></p></div></div></div></body>'

                };

                res.sendStatus(200);

                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                    //console.log("Security mail sent to old address");
                });


                // send mail with defined transport object
                transporter.sendMail(verifyMailOptions, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                    //console.log("Verifiy your email address email sent to new email address");
                });


            }); //End edit function 


        } //End IF for Email Edit


        //Application Portal
        if (applicationportal) {

            //Update Application Portal    
            Universities.EditUniversityApplicationPortal(id, applicationportal, {}, function (err, university) {
                //console.log(university);    
                if (err) {
                    return console.log(err);
                }

                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>APPLICATION PORTAL</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited</p></div></div></div></body>'

                }

                let verifyMailOptions = {

                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                    to: university.email, // list of receivers
                    subject: university.first_name + ' please verify your ' + university.university + ' application portal',
                    text: 'Please view this email as HTML,Verify your application portal', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><center><p>Please verify the change to your application portal to activate your account</p></center><center><a href="http://localhost:3000/#/verify/' + university.email + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#00BF4B; border-radius: 60px; text-decoration:none;"> Verfiy Portal</a></center><center><b>Are you ' + university.university + ' verification steps ?</b></center> As part of our data privacy and user protection, your account will need further verification to confirm if you are a university.<br> <br> <b>Step 1:</b> We will give your university a call on the number you provided on registration <br><b>Step 2:</b> We will send an email to your university admission email address to confirm if it is functional and truly owned by a university <br><br>   You can start using your account, as soon as we finish our verification, usually by phone or email.<br>Be sure, we will be in touch soon, In the mean time, should you have need to speak to us or if your information is taking longer than usual to be verified, please contact support: <b>1 (201) 992-1664 </b><center><a href="mailto:admissions@studyinbudapest.com" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#1e88e5; border-radius: 60px; text-decoration:none;"> Check Status</a><br></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration: underline;">Unsubscribe</a></p></div></div></div></body>'

                };

                res.sendStatus(200);


                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

                transporter.sendMail(verifyMailOptions, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

            });

        }

        //IF Password
        if (password) {
            //Update Password
            Universities.EditUniversityPassword(id, password, {}, function (err, university) {
                //console.log(university);    
                if (err) {
                    return console.log(err);
                }
                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>PASSWORD</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited</p></div></div></div></body>'

                }
                res.sendStatus(200);
                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

            });
        }

        //IF Phone Number
        if (phonenumber) {
            //Update Phone Number
            Universities.EditUniversityPhone(id, phonenumber, {}, function (err, university) {

                if (err) {
                    return console.log(err);
                }
                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>PHONE NUMBER</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited</p></div></div></div></body>'

                }
                res.sendStatus(200);
                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

            });
        }



    });

    goziextech.put('/edit/universities/2/:_id', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {

        var id = req.params._id;
        var universitydetails = req.body; //pass every data from body 
        var universityfirstname = universitydetails.first_name;
        var universitylastname = universitydetails.last_name;
        var universityemail = universitydetails.email;
        var password = universitydetails.password;
        var phonenumber = universitydetails.phone;
        var applicationportal = universitydetails.application_portal;
        var oldemail = universitydetails.oldemail;

        //1. If Email and Phone
        if ((universityemail) && (phonenumber)) {
            //Update Email and Phone
            Universities.EditUniversityEmailPhone(id, universityemail, phonenumber, {}, function (err, university) {
                if (err) {
                    return console.log(err);
                }

                //unverify    
                Universities.unVerifyUniversityEmail(id, {}, function (err, unverifieduniversity) {
                    if (err) {
                        return console.log(err);
                    }
                });

                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>EMAIL AND PHONE NUMBER</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited</p></div></div></div></body>'

                }

                let verifyMailtoNewEmailAddress = {

                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                    to: universityemail, // list of receivers
                    subject: university.first_name + ' please verify your ' + university.university + ' email address',
                    text: 'Please view this email as HTML,Verify your email address', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><center><p>Please verify your email address to activate your account</p></center><center><a href="http://localhost:3000/#/verify/' + universityemail + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#00BF4B; border-radius: 60px; text-decoration:none;"> Verfiy your email</a></center><center><b>Are you ' + university.university + ' verification steps ?</b></center> As part of our data privacy and user protection, your account will need further verification to confirm if you are a university.<br> <br> <b>Step 1:</b> We will give your university a call on the number you provided on registration <br><b>Step 2:</b> We will send an email to your university admission email address to confirm if it is functional and truly owned by a university <br><br>   You can start using your account, as soon as we finish our verification, usually by phone or email.<br>Be sure, we will be in touch soon, In the mean time, should you have need to speak to us or if your information is taking longer than usual to be verified, please contact support: <b>1 (201) 992-1664 </b><center><a href="mailto:admissions@studyinbudapest.com" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#1e88e5; border-radius: 60px; text-decoration:none;"> Check verification status</a><br></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration: underline;">Unsubscribe</a></p></div></div></div></body>'

                };

                res.sendStatus(200);

                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

                transporter.sendMail(verifyMailtoNewEmailAddress, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

            });

        }

        //2. Email and Password
        if (universityemail && password) {
            //Update Email Password
            Universities.EditUniversityEmailPassword(id, password, universityemail, {}, function (err, university) {
                //console.log(university);    
                if (err) {
                    return console.log(err);
                }

                //unverify    
                Universities.unVerifyUniversityEmail(id, {}, function (err, unverifieduniversity) {
                    if (err) {
                        return console.log(err);
                    }
                });

                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>EMAIL AND PASSWORD</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited</p></div></div></div></body>'

                }
                let verifyMailtoNewEmailAddress = {

                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                    to: universityemail, // list of receivers
                    subject: university.first_name + ' please verify your ' + university.university + ' email address',
                    text: 'Please view this email as HTML,Verify your email address', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><center><p>Please verify your email address to activate your account</p></center><center><a href="http://localhost:3000/#/verify/' + universityemail + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#00BF4B; border-radius: 60px; text-decoration:none;"> Verfiy your email</a></center><center><b>Are you ' + university.university + ' verification steps ?</b></center> As part of our data privacy and user protection, your account will need further verification to confirm if you are a university.<br> <br> <b>Step 1:</b> We will give your university a call on the number you provided on registration <br><b>Step 2:</b> We will send an email to your university admission email address to confirm if it is functional and truly owned by a university <br><br>   You can start using your account, as soon as we finish our verification, usually by phone or email.<br>Be sure, we will be in touch soon, In the mean time, should you have need to speak to us or if your information is taking longer than usual to be verified, please contact support: <b>1 (201) 992-1664 </b><center><a href="mailto:admissions@studyinbudapest.com" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#1e88e5; border-radius: 60px; text-decoration:none;"> Check verification status</a><br></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration: underline;">Unsubscribe</a></p></div></div></div></body>'

                };

                res.sendStatus(200);

                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

                transporter.sendMail(verifyMailtoNewEmailAddress, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

            });
        }

        //3. Email and First name
        if (universityemail && universityfirstname) {
            //Update Email First name
            Universities.EditUniversityFirstNameEmail(id, universityfirstname, universityemail, {}, function (err, university) {

                if (err) {
                    return console.log(err);
                }

                //unverify    
                Universities.unVerifyUniversityEmail(id, {}, function (err, unverifieduniversity) {
                    if (err) {
                        return console.log(err);
                    }
                });



                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>EMAIL AND FIRST NAME</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited</p></div></div></div></body>'

                }

                let verifyMailtoNewEmailAddress = {

                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                    to: universityemail, // list of receivers
                    subject: university.first_name + ' please verify your ' + university.university + ' email address',
                    text: 'Please view this email as HTML,Verify your email address', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><center><p>Please verify your email address to activate your account</p></center><center><a href="http://localhost:3000/#/verify/' + universityemail + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#00BF4B; border-radius: 60px; text-decoration:none;"> Verfiy your email</a></center><center><b>Are you ' + university.university + ' verification steps ?</b></center> As part of our data privacy and user protection, your account will need further verification to confirm if you are a university.<br> <br> <b>Step 1:</b> We will give your university a call on the number you provided on registration <br><b>Step 2:</b> We will send an email to your university admission email address to confirm if it is functional and truly owned by a university <br><br>   You can start using your account, as soon as we finish our verification, usually by phone or email.<br>Be sure, we will be in touch soon, In the mean time, should you have need to speak to us or if your information is taking longer than usual to be verified, please contact support: <b>1 (201) 992-1664 </b><center><a href="mailto:admissions@studyinbudapest.com" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#1e88e5; border-radius: 60px; text-decoration:none;"> Check verification status</a><br></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration: underline;">Unsubscribe</a></p></div></div></div></body>'

                };

                res.sendStatus(200);

                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

                transporter.sendMail(verifyMailtoNewEmailAddress, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });


            });
        }

        //4.Password and Phone
        if (password && phonenumber) {
            //Update Password Phone
            Universities.EditUniversityPasswordPhone(id, password, phonenumber, {}, function (err, university) {

                if (err) {
                    return console.log(err);
                }
                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>PASSWORD AND PHONE</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited</p></div></div></div></body>'

                }

                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                    //console.log('Message sent: %s', info.messageId);
                    //console.log(securityMail);
                });
                res.json(university);
            });
        }

        //5. First Name and Password
        if (universityfirstname && password) {
            //Update First Name Password
            Universities.EditUniversityFullnamePassword(id, universityfirstname, password, {}, function (err, university) {
                if (err) {
                    return console.log(err);
                }
                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>FIRST NAME AND PASSWORD</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited</p></div></div></div></body>'

                }
                res.sendStatus(200);
                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }

                });
            });
        }

        //6. First Name and Phone Number
        if (universityfirstname && phonenumber) {
            //Update First Name Phone Number
            Universities.EditUniversityPhoneFullname(id, universityfirstname, phonenumber, {}, function (err, university) {

                if (err) {
                    return console.log(err);
                }
                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>FIRST NAME AND PHONE NUMBER</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited</p></div></div></div></body>'

                }
                res.sendStatus(200);
                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }

                });

            });
        }


        //7. Last Name and First Name
        if (universityfirstname && universitylastname) {
            //Update Last Name Full Name
            Universities.EditUniversityLastNameFullName(id, universityfirstname, universitylastname, {}, function (err, university) {

                if (err) {
                    return console.log(err);
                }
                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>LAST NAME AND FIRST NAME</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited</p></div></div></div></body>'

                }
                res.sendStatus(200);
                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }

                });

            });
        }

        //8. Last Name and Password
        if (universitylastname && password) {
            //Update Last Name Password
            Universities.EditUniversityLastNamePassword(id, universitylastname, password, {}, function (err, university) {

                if (err) {
                    return console.log(err);
                }
                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>LAST NAME AND PASSWORD</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited</p></div></div></div></body>'

                }
                res.sendStatus(200);
                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }

                });

            });
        }

        //9. Last Name and Email
        if (universitylastname && universityemail) {
            //Update Last Name Email
            Universities.EditUniversityLastNameEmail(id, universitylastname, universityemail, {}, function (err, university) {
                //console.log(university);    
                if (err) {
                    return console.log(err);
                }

                //unverify    
                Universities.unVerifyUniversityEmail(id, {}, function (err, unverifieduniversity) {
                    if (err) {
                        return console.log(err);
                    }
                });


                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>LAST NAME AND EMAIL</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited</p></div></div></div></body>'

                }

                let verifyMailtoNewEmailAddress = {

                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                    to: universityemail, // list of receivers
                    subject: university.first_name + ' please verify your ' + university.university + ' email address',
                    text: 'Please view this email as HTML,Verify your email address', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><center><p>Please verify your email address to activate your account</p></center><center><a href="http://localhost:3000/#/verify/' + universityemail + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#00BF4B; border-radius: 60px; text-decoration:none;"> Verfiy your email</a></center><center><b>Are you ' + university.university + ' verification steps ?</b></center> As part of our data privacy and user protection, your account will need further verification to confirm if you are a university.<br> <br> <b>Step 1:</b> We will give your university a call on the number you provided on registration <br><b>Step 2:</b> We will send an email to your university admission email address to confirm if it is functional and truly owned by a university <br><br>   You can start using your account, as soon as we finish our verification, usually by phone or email.<br>Be sure, we will be in touch soon, In the mean time, should you have need to speak to us or if your information is taking longer than usual to be verified, please contact support: <b>1 (201) 992-1664 </b><center><a href="mailto:admissions@studyinbudapest.com" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#1e88e5; border-radius: 60px; text-decoration:none;"> Check verification status</a><br></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration: underline;">Unsubscribe</a></p></div></div></div></body>'

                };

                res.sendStatus(200);

                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

                transporter.sendMail(verifyMailtoNewEmailAddress, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });
            });
        }

        //10. Last Name and Phone Number
        if (universitylastname && phonenumber) {
            //Update Last Name Phone Number
            Universities.EditUniversityLastNamePhoneNumber(id, universitylastname, phonenumber, {}, function (err, university) {

                if (err) {
                    return console.log(err);
                }
                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>LAST NAME AND PHONE NUMBER</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited </p></div></div></div></body>'

                }
                res.sendStatus(200);
                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

            });
        }

        //11. University FirstName and Application Portal 
        if (universityfirstname && applicationportal) {
            //Update University FirstName and Application Portal 
            Universities.EditFirstNameApplicationPortal(id, universityfirstname, applicationportal, {}, function (err, university) {
                if (err) {
                    return console.log(err);
                }
                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>FIRST NAME AND APPLICATION PORTAL</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited </p></div></div></div></body>'

                }
                res.sendStatus(200);
                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }

                });
            });
        }

        //12. University Last Name and Application Portal 
        if (universitylastname && applicationportal) {
            //Update University FirstName and Application Portal 
            Universities.EditLastNameApplicationPortal(id, universitylastname, applicationportal, {}, function (err, university) {

                if (err) {
                    return console.log(err);
                }
                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>LAST NAME AND APPLICATION PORTAL</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited </p></div></div></div></body>'

                }
                res.sendStatus(200);
                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });
            });
        }

        //13. University Email Application Portal  
        if (universityemail && applicationportal) {
            //University Email Application Portal  
            Universities.EditEmailApplicationPortal(id, universityemail, applicationportal, {}, function (err, university) {
                if (err) {
                    return console.log(err);
                }

                //unverify    
                Universities.unVerifyUniversityEmail(id, {}, function (err, unverifieduniversity) {
                    if (err) {
                        return console.log(err);
                    }
                });


                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>EMAIL AND APPLICATION PORTAL</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited </p></div></div></div></body>'

                }

                let verifyMailtoNewEmailAddress = {

                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                    to: universityemail, // list of receivers
                    subject: university.first_name + ' please verify your ' + university.university + ' email address',
                    text: 'Please view this email as HTML,Verify your email address', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><center><p>Please verify your email address to activate your account</p></center><center><a href="http://localhost:3000/#/verify/' + universityemail + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#00BF4B; border-radius: 60px; text-decoration:none;"> Verfiy your email</a></center><center><b>Are you ' + university.university + ' verification steps ?</b></center> As part of our data privacy and user protection, your account will need further verification to confirm if you are a university.<br> <br> <b>Step 1:</b> We will give your university a call on the number you provided on registration <br><b>Step 2:</b> We will send an email to your university admission email address to confirm if it is functional and truly owned by a university <br><br>   You can start using your account, as soon as we finish our verification, usually by phone or email.<br>Be sure, we will be in touch soon, In the mean time, should you have need to speak to us or if your information is taking longer than usual to be verified, please contact support: <b>1 (201) 992-1664 </b><center><a href="mailto:admissions@studyinbudapest.com" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#1e88e5; border-radius: 60px; text-decoration:none;"> Check verification status</a><br></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration: underline;">Unsubscribe</a></p></div></div></div></body>'

                };

                res.sendStatus(200);

                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

                transporter.sendMail(verifyMailtoNewEmailAddress, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });
            });
        }

        //14. University Password Application Portal  
        if (password && applicationportal) {
            // Update University Password Application Portal 
            Universities.EditPasswordApplicationPortal(id, password, applicationportal, {}, function (err, university) {
                if (err) {
                    return console.log(err);
                }
                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>PASSWORD AND APPLICATION PORTAL</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited </p></div></div></div></body>'

                }
                res.sendStatus(200);
                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }

                });
            });
        }

        //13. University Phone Application Portal  
        if (phonenumber && applicationportal) {

            Universities.EditPhoneApplicationPortal(id, phonenumber, applicationportal, {}, function (err, university) {
                if (err) {
                    return console.log(err);
                }
                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>PHONE AND APPLICATION PORTAL</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited </p></div></div></div></body>'

                }
                res.sendStatus(200);
                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });
            });


        }
    });

    goziextech.put('/universities/edit/all/:_id', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        var id = req.params._id;
        var universitydetails = req.body;
        var universityfirstname = universitydetails.first_name;
        var universitylastname = universitydetails.last_name;
        var universityemail = universitydetails.email;
        var password = universitydetails.password;
        var phonenumber = universitydetails.phone;
        var applicationportal = universitydetails.application_portal;
        var oldemail = universitydetails.oldemail;

        //11. First Name, Last Name,Email and Password
        if ((universityfirstname) && (universitylastname) && (universityemail) && (password) && (!phonenumber) && (!applicationportal)) {

            Universities.EditFirstNameLastNameEmailPassword(id, universityfirstname, universitylastname, universityemail, password, {}, function (err, university) {
                if (err) {
                    return console.log(err);
                }

                //unverify    
                Universities.unVerifyUniversityEmail(id, {}, function (err, unverifieduniversity) {
                    if (err) {
                        return console.log(err);
                    }
                });


                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>account information</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited </p></div></div></div></body>'

                }

                let verifyMailtoNewEmailAddress = {

                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                    to: universityemail, // list of receivers
                    subject: university.first_name + ' please verify your ' + university.university + ' email address',
                    text: 'Please view this email as HTML,Verify your email address', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><center><p>Please verify your email address to activate your account</p></center><center><a href="http://localhost:3000/#/verify/' + universityemail + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#00BF4B; border-radius: 60px; text-decoration:none;"> Verfiy your email</a></center><center><b>Are you ' + university.university + ' verification steps ?</b></center> As part of our data privacy and user protection, your account will need further verification to confirm if you are a university.<br> <br> <b>Step 1:</b> We will give your university a call on the number you provided on registration <br><b>Step 2:</b> We will send an email to your university admission email address to confirm if it is functional and truly owned by a university <br><br>   You can start using your account, as soon as we finish our verification, usually by phone or email.<br>Be sure, we will be in touch soon, In the mean time, should you have need to speak to us or if your information is taking longer than usual to be verified, please contact support: <b>1 (201) 992-1664 </b><center><a href="mailto:admissions@studyinbudapest.com" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#1e88e5; border-radius: 60px; text-decoration:none;"> Check verification status</a><br></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration: underline;">Unsubscribe</a></p></div></div></div></body>'

                };

                res.sendStatus(200);

                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

                transporter.sendMail(verifyMailtoNewEmailAddress, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

            });
        }


        //12. First Name, Last Name,Email
        if ((universityfirstname) && (universitylastname) && (universityemail) && (!password) && (!phonenumber) && (!applicationportal)) {
            //Update First Name, Last Name,Email
            Universities.EditFirstNameLastNameEmail(id, universityfirstname, universitylastname, universityemail, {}, function (err, university) {
                if (err) {
                    return console.log(err);
                }

                //unverify    
                Universities.unVerifyUniversityEmail(id, {}, function (err, unverifieduniversity) {
                    if (err) {
                        return console.log(err);
                    }
                });


                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>account information</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited </p></div></div></div></body>'

                }

                let verifyMailtoNewEmailAddress = {

                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                    to: universityemail, // list of receivers
                    subject: university.first_name + ' please verify your ' + university.university + ' email address',
                    text: 'Please view this email as HTML,Verify your email address', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><center><p>Please verify your email address to activate your account</p></center><center><a href="http://localhost:3000/#/verify/' + universityemail + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#00BF4B; border-radius: 60px; text-decoration:none;"> Verfiy your email</a></center><center><b>Are you ' + university.university + ' verification steps ?</b></center> As part of our data privacy and user protection, your account will need further verification to confirm if you are a university.<br> <br> <b>Step 1:</b> We will give your university a call on the number you provided on registration <br><b>Step 2:</b> We will send an email to your university admission email address to confirm if it is functional and truly owned by a university <br><br>   You can start using your account, as soon as we finish our verification, usually by phone or email.<br>Be sure, we will be in touch soon, In the mean time, should you have need to speak to us or if your information is taking longer than usual to be verified, please contact support: <b>1 (201) 992-1664 </b><center><a href="mailto:admissions@studyinbudapest.com" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#1e88e5; border-radius: 60px; text-decoration:none;"> Check verification status</a><br></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration: underline;">Unsubscribe</a></p></div></div></div></body>'

                };

                res.sendStatus(200);

                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

                transporter.sendMail(verifyMailtoNewEmailAddress, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

            });
        }

        // First Name, Last Name and Password
        if ((universityfirstname) && (universitylastname) && (!universityemail) && (password) && (!phonenumber) && (!applicationportal)) {
            //Update First Name, Last Name and Password
            Universities.EditUniversityFirstnameLastnamePassword(id, universityfirstname, universitylastname, password, {}, function (err, university) {
                if (err) {
                    return console.log(err);
                }
                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>FIRST NAME LASTNAME AND PASSWORD</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited</p></div></div></div></body>'

                }
                res.sendStatus(200);
                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }

                });
            });
        }

        //13. First Name, Last Name,Email, Password, Phone Number and Application Portal
        if (universityfirstname && universitylastname && universityemail && password && phonenumber && applicationportal) {

            Universities.EditAllUniversityDetail(id, universityfirstname, universitylastname, universityemail, password, phonenumber, applicationportal, {}, function (err, university) {
                if (err) {
                    return console.log(err);
                }

                //unverify    
                Universities.unVerifyUniversityEmail(id, {}, function (err, unverifieduniversity) {
                    if (err) {
                        return console.log(err);
                    }
                });


                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>account information</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited </p></div></div></div></body>'

                }

                let verifyMailtoNewEmailAddress = {

                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                    to: universityemail, // list of receivers
                    subject: university.first_name + ' please verify your ' + university.university + ' email address',
                    text: 'Please view this email as HTML,Verify your email address', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><center><p>Please verify your email address to activate your account</p></center><center><a href="http://localhost:3000/#/verify/' + universityemail + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#00BF4B; border-radius: 60px; text-decoration:none;"> Verfiy your email</a></center><center><b>Are you ' + university.university + ' verification steps ?</b></center> As part of our data privacy and user protection, your account will need further verification to confirm if you are a university.<br> <br> <b>Step 1:</b> We will give your university a call on the number you provided on registration <br><b>Step 2:</b> We will send an email to your university admission email address to confirm if it is functional and truly owned by a university <br><br>   You can start using your account, as soon as we finish our verification, usually by phone or email.<br>Be sure, we will be in touch soon, In the mean time, should you have need to speak to us or if your information is taking longer than usual to be verified, please contact support: <b>1 (201) 992-1664 </b><center><a href="mailto:admissions@studyinbudapest.com" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#1e88e5; border-radius: 60px; text-decoration:none;"> Check verification status</a><br></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration: underline;">Unsubscribe</a></p></div></div></div></body>'

                };

                res.sendStatus(200);

                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

                transporter.sendMail(verifyMailtoNewEmailAddress, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

            });
        }

        //13. First Name, Last Name,Email and Application Portal
        if ((universityfirstname) && (universitylastname) && (universityemail) && (!password) && (!phonenumber) && (applicationportal)) {
            //Update First Name, Last Name,Email and Application Portal
            Universities.EditFirstNameLastNameEmailApplicationPortal(id, universityfirstname, universitylastname, universityemail, applicationportal, {}, function (err, university) {
                if (err) {
                    return console.log(err);
                }

                //unverify    
                Universities.unVerifyUniversityEmail(id, {}, function (err, unverifieduniversity) {
                    if (err) {
                        return console.log(err);
                    }
                });


                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b>First Name, Last Name,Email and Application Portal</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited </p></div></div></div></body>'

                }

                let verifyMailtoNewEmailAddress = {

                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                    to: universityemail, // list of receivers
                    subject: university.first_name + ' please verify your ' + university.university + ' email address',
                    text: 'Please view this email as HTML,Verify your email address', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><center><p>Please verify your email address to activate your account</p></center><center><a href="http://localhost:3000/#/verify/' + universityemail + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#00BF4B; border-radius: 60px; text-decoration:none;"> Verfiy your email</a></center><center><b>Are you ' + university.university + ' verification steps ?</b></center> As part of our data privacy and user protection, your account will need further verification to confirm if you are a university.<br> <br> <b>Step 1:</b> We will give your university a call on the number you provided on registration <br><b>Step 2:</b> We will send an email to your university admission email address to confirm if it is functional and truly owned by a university <br><br>   You can start using your account, as soon as we finish our verification, usually by phone or email.<br>Be sure, we will be in touch soon, In the mean time, should you have need to speak to us or if your information is taking longer than usual to be verified, please contact support: <b>1 (201) 992-1664 </b><center><a href="mailto:admissions@studyinbudapest.com" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#1e88e5; border-radius: 60px; text-decoration:none;"> Check verification status</a><br></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration: underline;">Unsubscribe</a></p></div></div></div></body>'

                };

                res.sendStatus(200);

                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

                transporter.sendMail(verifyMailtoNewEmailAddress, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

            });
        }




        //13. Last Name,Email and Application Portal
        if ((!universityfirstname) && (universitylastname) && (universityemail) && (!password) && (!phonenumber) && (applicationportal)) {
            //Update Last Name,Email and Application Portal
            Universities.EditLastNameEmailApplicationPortal(id, universitylastname, universityemail, applicationportal, {}, function (err, university) {
                if (err) {
                    return console.log(err);
                }

                //unverify    
                Universities.unVerifyUniversityEmail(id, {}, function (err, unverifieduniversity) {
                    if (err) {
                        return console.log(err);
                    }
                });


                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b> Last Name,Email and Application Portal</b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited </p></div></div></div></body>'

                }

                let verifyMailtoNewEmailAddress = {

                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                    to: universityemail, // list of receivers
                    subject: university.first_name + ' please verify your ' + university.university + ' email address',
                    text: 'Please view this email as HTML,Verify your email address', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><center><p>Please verify your email address to activate your account</p></center><center><a href="http://localhost:3000/#/verify/' + universityemail + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#00BF4B; border-radius: 60px; text-decoration:none;"> Verfiy your email</a></center><center><b>Are you ' + university.university + ' verification steps ?</b></center> As part of our data privacy and user protection, your account will need further verification to confirm if you are a university.<br> <br> <b>Step 1:</b> We will give your university a call on the number you provided on registration <br><b>Step 2:</b> We will send an email to your university admission email address to confirm if it is functional and truly owned by a university <br><br>   You can start using your account, as soon as we finish our verification, usually by phone or email.<br>Be sure, we will be in touch soon, In the mean time, should you have need to speak to us or if your information is taking longer than usual to be verified, please contact support: <b>1 (201) 992-1664 </b><center><a href="mailto:admissions@studyinbudapest.com" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#1e88e5; border-radius: 60px; text-decoration:none;"> Check verification status</a><br></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration: underline;">Unsubscribe</a></p></div></div></div></body>'

                };

                res.sendStatus(200);

                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

                transporter.sendMail(verifyMailtoNewEmailAddress, (error, info) => {
                    if (error) {
                        //res.sendStatus(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });

            });
        }

        //14. Application Portal, Password and Phone
        if ((!universityfirstname) && (!universitylastname) && (!universityemail) && (password) && (phonenumber) && (applicationportal)) {
            //Update Application Portal, Password and Phone
            Universities.EditApplicationPortalPasswordPhone(id, applicationportal, password, phonenumber, {}, function (err, university) {
                if (err) {
                    return console.log(err);
                }
                let securityMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Security: Your account information has been changed!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + university.first_name + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just changed your <b> Application Portal, Password and Phone </b>, if you did not initiate this request or change please  do not ignore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited </p></div></div></div></body>'

                }
                res.sendStatus(200);
                transporter.sendMail(securityMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }

                }); //End Transporter   

            });
        }

    });

    //Deactivate Trial
    goziextech.post('/deactivatetrial', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        var id = req.body.id;
        Universities.deactivateTrialPeriod(id, function (err, deactivateduniversity) {
            if (err) {
                return console.log(err);
            }
            if (deactivateduniversity) {
                res.json(deactivateduniversity)
            }
        });

    });

    //Deactivate Subscription
    goziextech.post('/deactivatesubscription', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        var id = req.body.id;
        Universities.resetSubscription(id, function (err, deactivateduniversity) {
            if (err) {
                return console.log(err);
            }
            if (deactivateduniversity) {
                res.json(deactivateduniversity)
            } else {
                res.sendStatus(401); //Not found 
            }
        });

    });

    //Email Activation
    goziextech.post('/verify/:email', ensurePostPutDeleteIsAuthorized, function (req, res, next) {
        var email = req.params.email;

        Universities.getUniversityByEmail(email, function (err, university) {
            if (err) {
                return console.log(err);
            }
            if (!university) {
                res.json({
                    status: "usernotfound"
                });
            } else if (university) {

                Universities.verifyUniversityEmail(university, function (err, university) {
                    //console.log(university);    
                    res.json(university)
                });

            } // end else 
        });

    });

    //Email Activation
    goziextech.post('/activate/:email', ensurePostPutDeleteIsAuthorized, function (req, res, next) {
        var email = req.params.email;

        Universities.getUniversityByEmail(email, function (err, university) {
            if (err) {
                return console.log(err);
            }
            if (!university) {
                res.json({
                    status: "usernotfound"
                });
            } else if (university) {

                Universities.activateAccount(university, function (err, university) {
                    res.json(university)
                });

            } // end else 
        });

    });

    //Email Activation
    goziextech.post('/deactivate/:_id', ensurePostPutDeleteIsAuthorized, function (req, res, next) {
        var id = req.params._id;

        Universities.deactivateAccount(id, function (err, university) {
            if (err) {
                return console.log(err);
            } else if (university) {



                let uniReactivateEmail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                    to: "admissions@studyinbudapest.com", // list of receivers
                    subject: university.university + ' has been deactivated!',
                    text: 'Please view this email as HTML,Application Recieved', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8;"><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>Hi Goziex Tech</b><p><center>' + university.university + ' has recently been deactivated manually by an administrator of Goziex Technologies Limited</p></center><center><p>If you will like to reactivate the university</p></center><center><a href="http://localhost:3000/#/activate/' + university.email + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #32CD32; border-radius: 60px; text-decoration:none;"> Reactivate Account </a></center><p>Study in Budapest connects international students with universities and makes it easy for students to apply for admission to one university and get recruited by multiple universities, travel, visa, and city guide in one app.</p><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration:underline;">Unsubscribe</a> </p></div></div></div></body>'
                };

                let verifyMailOptions = {

                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                    to: university.universityemail, // list of receivers
                    subject: university.first_name + ' your ' + university.university + ' has been deactivated',
                    text: 'Please view this email as HTML,Verify your email address', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><center><p> Your account has recently been deactivated, this could be due to security reasons, please verify your email address to activate your account, if after versification, your account is still in active please contact support</p></center><center><a href="http://localhost:3000/#/verify/' + university.universityemail + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#00BF4B; border-radius: 60px; text-decoration:none;"> Verfiy your email</a></center><center><b>Are you ' + university.university + ' verification steps ?</b></center> As part of our data privacy and user protection, your account will need further verification to confirm if you are a university.<br> <br> <b>Step 1:</b> We will give your university a call on the number you provided on registration <br><b>Step 2:</b> We will send an email to your university admission email address to confirm if it is functional and truly owned by a university <br><br>   You can start using your account, as soon as we finish our verification, usually by phone or email.<br>Be sure, we will be in touch soon, In the mean time, should you have need to speak to us or if your information is taking longer than usual to be verified, please contact support: <b>1 (201) 992-1664 </b><center><a href="mailto:admissions@studyinbudapest.com" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background:#1e88e5; border-radius: 60px; text-decoration:none;"> Check verification status</a><br></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited <br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration: underline;">Unsubscribe</a></p></div></div></div></body>'

                };

                res.sendStatus(200);

                transporter.sendMail(verifyMailOptions, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        //console.log("Verifiy your email address email sent to new email address");
                        res.sendStatus(200);
                    }

                });

                transporter.sendMail(uniReactivateEmail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                });
            }
        });
    });


    //Unsubscribe university email
    goziextech.post('/university/unsubscribe/:email/:_id', ensurePostPutDeleteIsAuthorized, function (req, res, next) {
        var email = req.params.email;
        var uid = req.params._id;

        //Turn notififcation column of university   
        Universities.turnOffNotifications(uid, function (err, turnedoffuniversity) {
            if (err) {
                return console.log(err);
            } else if (turnedoffuniversity) {
                let turnOffNotifyMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: turnedoffuniversity.email, // reciever
                    subject: 'Account Info: Your notifications has been turned off!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;"> Hi ' + turnedoffuniversity.university + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-badge-study-in-budapest-mobile-app.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just turned off your <b>email notitifications</b>, you will no longer be able to recieve email notifications of students applying to other universities in your area<br><center><a href="http://localhost:3000/" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Turn it on </a></center></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited</p></div></div></div></body>'

                }
                res.sendStatus(200);
                transporter.sendMail(turnOffNotifyMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                }); //End Transporter   
            }

        });

    });

    //Unsubscribe university email
    goziextech.post('/university/subscribe', ensurePostPutDeleteIsAuthorized, function (req, res, next) {
        //var university = req.body;
        var universityid = req.body.uid;

        Universities.turnOnNotifications(universityid, function (err, university) {
            if (err) {
                return console.log(err);
            }
            res.sendStatus(200);
            if (university) {
                let turnOnNotifyMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: university.email, // reciever
                    subject: 'Account Info: Your notifications has been turned on!',
                    text: 'Please view this email as HTML,Account Security: Your account information has been changed!', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;"> Hi ' + university.university + ',</h1><p style="margin-top:0px; color:#bbbbbb;"></p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Your <b>email notitifications settings</b> has been switched on, you will now be able to recieve email notifications of students applying to other universities in your area <br><center><a href="http://localhost:3000/#/email/unsubscribe/' + university.email + '/' + university._id + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Turn it off </a></center></p><center>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you need help, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited<br><a href="http://localhost:3000/#/email/unsubscribe/' + university.email + '/' + university._id + '" style="color: #b2b2b5; text-decoration: underline;">Unsubscribe</a> </p></div></div></div></body>'

                }

                transporter.sendMail(turnOnNotifyMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }
                }); //End Transporter   
            }

        });
    });


    //P Reset
    goziextech.post('/reset', ensurePostPutDeleteIsAuthorized, function (req, res, next) {
        var email = req.body.useremail;

        Universities.getUniversityByEmail(email, function (err, university) {
            if (err) {
                return console.log(err);
            }
            if (!university) {
                res.json({
                    status: "usernotfound"
                });
            } else if (university) {

                //Universities.resetUniversityp( university, function(err,university){
                res.json(university)
                var password = university.password;
                var email = university.email;
                var firstname = university.first_name.toUpperCase();

                let resetMail = {
                    from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com',
                    to: email, // list of receivers
                    subject: firstname + ' here is your password reset instructions',
                    text: 'Please view this email as HTML,Password Reset Instructions', // plain text body
                    html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="border-bottom:1px solid #f6f6f6;"><h1 style="font-size:14px; font-family:arial; margin:0px; font-weight:bold;">' + firstname + ',</h1><center><img src="http://www.studyinbudapest.com/images/emailassets/security-icon-300x300-blue-study-in-budapest.png" style="display:block; width:10%"></center><p style="margin-top:0px; color:#bbbbbb;">Here are your password reset instructions.</p></td></tr><tr><td style="padding:10px 0 30px 0;"><p>Someone has just requested the password to your account, if you did not initiate this request or change please igonore this email and kindly <a href="http://help.studyinbudapest.com"> contact support</a></p><center><b>PASSWORD:' + password + '</b></center><b>- Thanks Studyinbudapest</b></td></tr><tr><td  style="border-top:1px solid #f6f6f6; padding-top:20px; color:#777">If you continue to have problems, please feel free to contact us at support@studyinbudapest.com</td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited<br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration: underline;">Unsubscribe</a> </p></div></div></div></body>'

                }
                // });

                transporter.sendMail(resetMail, (error, info) => {
                    if (error) {
                        //res.send(500);
                        return console.log(error);
                    } else {
                        res.sendStatus(200);
                    }

                });



            } // end else 
        });

    });


    //Delete university details
    goziextech.delete('/universities/:_id', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        var id = req.params._id;
        Universities.deleteUniversity(id, function (err, university) {
            if (err) {
                return console.log(err);
            }
            res.json(university);
        });
    });

    //Get University by ID
    goziextech.post('/profile/universities/:_id', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        Universities.getUniversitiesById(req.params._id, function (err, university) {
            if (err) {
                return console.log(err);
            }
            res.json(university);
            //res.render('studentdashboard/index.html')    
        });

    });

    //Get Recruited Student by ID
    goziextech.post('/recruited/universities/:_id', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        Universities.getRecruitedStudentById(req.params._id, function (err, university) {
            if (err) {
                return console.log(err);
            }
            res.json(university);
            //res.render('studentdashboard/index.html')    
        });

    });


    //Update university student details
    goziextech.put('/universities/:_id', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        var id = req.params._id;
        var student = req.body;
        Universities.UpdateRecruitedStudents(id, student, {}, function (err, student) {
            if (err) {
                return console.log(err);
            }
            res.json(student);
        });
    });


    //Add Processed Student
    goziextech.put('/universities/proccessed/:_id', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        var id = req.params._id;
        var student = req.body;
        Universities.AddProcessedStudents(id, student, {}, function (err, student) {
            if (err) {
                return console.log(err);
            }
            res.json(student);
        });

    });


    //Update university plan
    goziextech.put('/universities/plan/:_id', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {

        var id = req.params._id;
        var plan = req.body.plan;
        var dateofsubscription = req.body.sub;
        //console.log(plan)    
        Universities.updateUniversityPlan(id, plan, dateofsubscription, {}, function (err, university) {
            //console.log(university);    
            if (err) {
                return console.log(err);
            }
            res.json(university);
        });

    });


    //Update student details
    goziextech.put('/students/:_id', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        var selectAppType = switchApps(req);
        var id = req.params._id;
        Students.updateStudent(id, selectAppType.recievedData, {}, function (err, replied) {
            logError(err);
            res.json(replied);
        });
    });


    //Handle Recruit Messages
    goziextech.post('/recruit', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {

        //Declare Variables
        var stdntfnmae = req.body.first_name;
        var lastname = req.body.last_name;
        var stdnteml = req.body.email;
        var std = req.body.student_id;
        var universityname = req.body.university;
        var country = req.body.country;
        var phone = req.body.phone;
        var course = req.body.course;
        var applicationstatus = req.body.application_status;
        var academicqualification = req.body.academic_qualification;
        var language = req.body.language_proficiency;
        var travel = req.body.travel_visa;
        var accountstatus = req.body.accountstatus;
        var onlineportal = req.body.onlineportal;
        var date = req.body.date;

        //var admsnofcr = req.body.admsnofcr; 
        //console.log(accountstatus);
        //console.log(onlineportal);

        if (accountstatus == "free") {

            let mailOptions = {
                from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                to: stdnteml, // list of receivers
                subject: ' Congratulations! ' + stdntfnmae + ' you recieved an application offer from ' + universityname + ' ',
                text: 'Please view this email as HTML,You recieved an application offer', // plain text body
                html: '<body style="margin:0px; background: #f8f8f8;"><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="http://www.studyinbudapest.com" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><center><div style="background:#grey; padding:20px; color:black;"> <div style="background-color:red; color:white; width:25px; height:25px; border-radius:20px; display:inline-block; margin-right:5px;"><center>1</center></div> Offer for ' + stdntfnmae + ' ' + lastname + ' </div> </center><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>' + stdntfnmae + '</b><p>Whats going on in <b>' + country + ' ? </b>' + universityname + ' will like to offer you an oppurtunity to apply to their university, to accept this application offer click</p><center><a href="http://www.studyinbudapest.com/download-api" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Apply now </a></center><p>You can read more about this university on your Studyinbudapest mobile app. Study in Budapest makes it easy for you to apply for admission to one university and get recruited by multiple universities, travel, visa, and city guide in one app</p><b>- Thanks Studyinbudapest<br><center><a href="http://www.studyinbudapest.com/download-api"><img src="http://www.studyinbudapest.com/images/emailassets/applegoole.png" alt="Studyinbudapest" style="border:none; display:block; width:60%"></a></center></b> </td></tr></tbody></table></div><center><div style="margin-top:20px"><a href="https://www.facebook.com/studyingbudapest"><img src="http://localhost:3000/plugins/images/Facebook-Icon-Circle-Outline-Grey.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a><a href="tel:+12019921664"><img src="http://localhost:3000/plugins/images/if_phone_281830.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%; "></a><a href="https://www.instagram.com/studyinbudapst"><img src="http://localhost:3000/plugins/images/if_instagram_281827.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a><a href="https://twitter.com/studyinbudapst"><img src="http://localhost:3000/plugins/images/if_twitter_281833.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a><a href="https://www.youtube.com/channel/UCxVJxK_vB8Oi5fqUFU8-I4g?view_as=subscriber"><img src="http://localhost:3000/plugins/images/if_youtube_281826.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a></div></center><div style="text-align: center; font-size: 12px; color: #b2b2b5; line-height: normal;"><p> Powered by Goziex Technologies Limited <p>This email was intended for ' + stdntfnmae + ' ' + lastname + ' (' + course + ' at ' + universityname + '). <a href="http://help.studyinbudapest.com">Learn why you are recieving this message </a> </p><p> © Study in Budapest, Study in Europe, is a registered business of Goziex Technologies LLC Company.</p><br>Already admitted? <a href="javascript: void(0);" style="color: #b2b2b5; text-decoration:underline;">Unsubscribe</a> </p></div></div></div></body>'
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    //res.send(500);
                    return console.log(error);
                } else {
                    res.sendStatus(200);
                }
                //console.log('Message sent: %s', info.messageId);
                //console.log(mailOptions);
            });


        } else {
            //If not free

            let mailOptions = {
                from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
                to: stdnteml, // list of receivers
                subject: ' Congratulations! ' + stdntfnmae + ' you recieved an application offer from ' + universityname + ' ',
                text: 'Please view this email as HTML,you recieved an application offer', // plain text body
                html: '<body style="margin:0px; background: #f8f8f8;"><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="http://www.studyinbudapest.com" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><center><div style="background:#grey; padding:20px; color:black;"> <div style="background-color:red; color:white; width:25px; height:25px; border-radius:20px; display:inline-block; margin-right:5px;"><center>1</center></div> Offer for ' + stdntfnmae + ' ' + lastname + ' </div> </center><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>' + stdntfnmae + '</b><p>Whats going on in <b>' + country + ' ? </b>' + universityname + ' will like to offer you an oppurtunity to apply to their university, to accept this application offer visit</p><center><a href="' + onlineportal + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> University Website </a></center><p>You can read more about this university on your Studyinbudapest mobile app. Study in Budapest makes it easy for you to apply for admission to one university and get recruited by multiple universities, travel, visa, and city guide in one app</p><b>- Thanks Studyinbudapest<br><center><a href="http://www.studyinbudapest.com/download-api"><img src="http://www.studyinbudapest.com/images/emailassets/applegoole.png" alt="Studyinbudapest" style="border:none; display:block; width:40%"></a></center></b> </td></tr></tbody></table></div><center><div style="margin-top:20px"><a href="https://www.facebook.com/studyingbudapest"><img src="http://localhost:3000/plugins/images/Facebook-Icon-Circle-Outline-Grey.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a><a href="tel:+12019921664"><img src="http://localhost:3000/plugins/images/if_phone_281830.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%; "></a><a href="https://www.instagram.com/studyinbudapst"><img src="http://localhost:3000/plugins/images/if_instagram_281827.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a><a href="https://twitter.com/studyinbudapst"><img src="http://localhost:3000/plugins/images/if_twitter_281833.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a><a href="https://www.youtube.com/channel/UCxVJxK_vB8Oi5fqUFU8-I4g?view_as=subscriber"><img src="http://localhost:3000/plugins/images/if_youtube_281826.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a></div></center><div style="text-align: center; font-size: 12px; color: #b2b2b5; line-height: normal;"><p> Powered by Goziex Technologies Limited <p>This email was intended for ' + stdntfnmae + ' ' + lastname + ' (' + course + ' at ' + universityname + '). <a href="http://help.studyinbudapest.com">Learn why you are recieving this message </a> </p><p> © Study in Budapest, Study in Europe, is a registered business of Goziex Technologies LLC Company.</p><br>Already admitted? <a href="javascript: void(0);" style="color: #b2b2b5; text-decoration:underline;">Unsubscribe</a> </p></div></div></div></body>'
            };
            res.sendStatus(200);
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    //res.send(500);
                    return console.log(error);
                } else {
                    res.sendStatus(200);
                }
                //console.log('Message sent: %s', info.messageId);
                //console.log(mailOptions);
            });



        }



    });

    //Delete recruited student
    goziextech.delete('/recruit/delete/:_id', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {

        var id = req.params._id;
        var studentid = req.body.id;

        Universities.deleteUniversityRecruitedstudent(id, studentid, {}, function (err, deletedstudent) {
            if (err) {
                return console.log(err);
            }
            res.json(deletedstudent);
        });

    });

    //Delete student details
    goziextech.delete('/students/:_id', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        var id = req.params._id;
        var uid = req.body.uid;

        Students.deleteStudent(id, function (err, student) {
            if (err) {
                return console.log(err);
            }
        });
        Universities.getUniversitiesById(uid, function (err, university) {
            if (err) {
                return console.log(err);
            } else if (university) {
                var oldNumberOfStudentCount = university.number_of_students;
                var newNumberOfStudentCount = oldNumberOfStudentCount - 1;
                Universities.reduceNumberOfStudentCount(uid, newNumberOfStudentCount, function (err, university) {
                    if (err) {
                        return console.log(err);
                    }

                });
            }
        });


        res.sendStatus(200);

    });

    //Delete Messaged student
    goziextech.delete('/messaged/delete/:_id', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {

        var id = req.params._id;
        var studentid = req.body.id;

        Universities.deleteUniversityMessagedstudent(id, studentid, {}, function (err, deletedstudent) {
            if (err) {
                return console.log(err);
            }
            res.json(deletedstudent);
        });

    });

     //Travel Message
     goziextech.post('/trvl/msg', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {

        var stdnteml = req.body.studentemail;
        var fname = (req.body.studentname).toUpperCase();
        var admsnofcr = req.body.admsnofcr;
        var uvrstynm = req.body.universityname;

        // setup email data with unicode symbols

        let TravelMessage = {

            from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
            to: stdnteml, // list of receivers
            subject: fname + ' You Recieved a Travel Assistance Package',
            text: 'Please view this email as HTML,You Recieved a Travel Assistance Package', // plain text body
            html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="http://www.studyinbudapest.com/" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>Hi ' + fname + ',</b><center><p><b>' + admsnofcr + '</b> from <b>' + uvrstynm + '</b> has just sent you the following travel services</p></center><center><img src="http://www.studyinbudapest.com/images/emailassets/aiport-taxi-em-study-in-budapest-study-in-europe-mobile-app-img1%20copy.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"><a href="http://www.studyinbudapest.com/download-api" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Airport Taxi </a></center><center><center><img src="http://www.studyinbudapest.com/images/emailassets/student-accomodation-hostel-em-study-in-budapest-study-in-europe-mobile-app-img1%20copy.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"><a href="http://www.studyinbudapest.com/download-api" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Find Hostel </a></center><center><img src="http://www.studyinbudapest.com/images/emailassets/student-flights-em-study-in-budapest-study-in-europe-mobile-app-img1%20copy.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"><a href="http://www.studyinbudapest.com/download-api" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Book Flight </a></center><center><img src="http://www.studyinbudapest.com/images/emailassets/travel-em-study-in-budapest-study-in-europe-mobile-app-image.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"><a href="http://www.studyinbudapest.com/download-api" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Insurance </a></center></center><b>- Thanks Studyinbudapest<br><center><a href="http://www.studyinbudapest.com/download-api"><img src="http://www.studyinbudapest.com/images/emailassets/applegoole.png" alt="Studyinbudapest" style="border:none; display:block; width:60%"></a></center></b> </td></tr></tbody></table></div><center><div style="margin-top:20px"><a href="https://www.facebook.com/studyingbudapest"><img src="http://localhost:3000/plugins/images/Facebook-Icon-Circle-Outline-Grey.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a><a href="tel:+12019921664"><img src="http://localhost:3000/plugins/images/if_phone_281830.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%; "></a><a href="https://www.instagram.com/studyinbudapst"><img src="http://localhost:3000/plugins/images/if_instagram_281827.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a><a href="https://twitter.com/studyinbudapst"><img src="http://localhost:3000/plugins/images/if_twitter_281833.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a><a href="https://www.youtube.com/channel/UCxVJxK_vB8Oi5fqUFU8-I4g?view_as=subscriber"><img src="http://localhost:3000/plugins/images/if_youtube_281826.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a></div></center><div style="text-align: center; font-size: 12px; color: #b2b2b5; line-height: normal;"><p> Powered by Goziex Technologies Limited </p><p>This email was intended for ' + fname + ' from ' + uvrstynm + '. <a href="http://help.studyinbudapest.com">Learn why you are recieving this message </a> </p><p> © Study in Budapest, Study in Europe, is a registered business of Goziex Technologies LLC Company.</p><br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration:underline;">Unsubscribe</a> </p></div></div></div></body>'

        };

        // send mail with defined transport object
        transporter.sendMail(TravelMessage, (error, info) => {
            if (error) {
                //res.send(500);
                return console.log(error);
            } else {
                res.sendStatus(200);
                //console.log("Travel Message Sent");
            }

        });

    });

    //Travel Message
    goziextech.post('/tvap/msg', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {


        
        var stdnteml = req.body.studentemail;
        var uvrstynm = req.body.universityname;

        // setup email data with unicode symbols

        let TvapMessage = {

            from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
            to: stdnteml, // list of receivers
            subject: ' You Recieved a Travel Assistance Package',
            text: 'Please view this email as HTML,You Recieved a Travel Assistance Package', // plain text body
            html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>Hi,</b><center><p><b>' + uvrstynm + '</b> has just sent you the following travel services</p></center><center><img src="http://www.studyinbudapest.com/images/emailassets/aiport-taxi-em-study-in-budapest-study-in-europe-mobile-app-img1%20copy.png" alt="Studyinbudapest" style="border:none; display:block; width:30%"><a href="http://www.studyinbudapest.com/download-api" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Airport Taxi </a></center><center><center><img src="http://www.studyinbudapest.com/images/emailassets/student-accomodation-hostel-em-study-in-budapest-study-in-europe-mobile-app-img1%20copy.png" alt="Studyinbudapest" style="border:none; display:block; width:30%"><a href="http://www.studyinbudapest.com/download-api" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Find Hostel </a></center><center><img src="http://www.studyinbudapest.com/images/emailassets/student-flights-em-study-in-budapest-study-in-europe-mobile-app-img1%20copy.png" alt="Studyinbudapest" style="border:none; display:block; width:30%"><a href="http://www.studyinbudapest.com/download-api" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Book Flight </a></center><center><img src="http://www.studyinbudapest.com/images/emailassets/travel-em-study-in-budapest-study-in-europe-mobile-app-image.png" alt="Studyinbudapest" style="border:none; display:block; width:30%"><a href="http://www.studyinbudapest.com/download-api" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Insurance </a></center></center><b>- Thanks Studyinbudapest<br><center><a href="http://www.studyinbudapest.com/download-api"><img src="http://www.studyinbudapest.com/images/emailassets/applegoole.png" alt="Studyinbudapest" style="border:none; display:block; width:60%"></a></center></b> </td></tr></tbody></table></div><center><div style="margin-top:20px"><a href="https://www.facebook.com/studyingbudapest"><img src="http://localhost:3000/plugins/images/Facebook-Icon-Circle-Outline-Grey.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a><a href="tel:+12019921664"><img src="http://localhost:3000/plugins/images/if_phone_281830.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%; "></a><a href="https://www.instagram.com/studyinbudapst"><img src="http://localhost:3000/plugins/images/if_instagram_281827.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a><a href="https://twitter.com/studyinbudapst"><img src="http://localhost:3000/plugins/images/if_twitter_281833.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a><a href="https://www.youtube.com/channel/UCxVJxK_vB8Oi5fqUFU8-I4g?view_as=subscriber"><img src="http://localhost:3000/plugins/images/if_youtube_281826.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a></div></center><div style="text-align: center; font-size: 12px; color: #b2b2b5; line-height: normal;"><p> Powered by Goziex Technologies Limited </p><p>This email was intended for ' + stdnteml + '. <a href="http://help.studyinbudapest.com">Learn why you are recieving this message </a> </p><p> © Study in Budapest, Study in Europe, is a registered business of Goziex Technologies LLC Company.</p><br><a href="javascript: void(0);" style="color: #b2b2b5; text-decoration:underline;">Unsubscribe</a> </p></div></div></div>'

        };

        // send mail with defined transport object
        transporter.sendMail(TvapMessage, (error, info) => {
            if (error) {
                //res.send(500);
                return console.log(error);
            } else {
                res.sendStatus(200);
            }
            //console.log('Message sent: %s', info.messageId);
            //console.log(TvapMessage);
        });
    });

    //Verify Message Welcome
    goziextech.post('/confirm/email', ensurePostPutDeleteIsAuthorized, function (req, res, next) {

    });

    //Invoice
    goziextech.post('/invoice', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        //Declare Variables
        var universityname = req.body.universityname;
        var universityemail = req.body.universityemail;
        var plan = req.body.plan;
        var amount = req.body.amount;
        var date = req.body.date;

        // setup email data with unicode symbols
        let invoice = {
            from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
            to: universityemail, // list of receivers
            subject: ' Payment Reciept',
            text: 'Please view this email as HTML,Your invoice is enclosed', // plain text body
            html: '<body style="margin:0px; background: #f8f8f8; "><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="javascript:void(0)" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td style="background:#1e88e5; padding:20px; color:#fff; text-align:center;"> Goziex Technologies Limited </td></tr></tbody></table><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td><b>' + universityname + '</b><p style="margin-top:0px;">Invoice</p></td><td align="right" width="100"> ' + date + '</td></tr><tr><td colspan="2" style="padding:20px 0; border-top:1px solid #f6f6f6;"><div><table width="100%" cellpadding="0" cellspacing="0"><tbody><tr><td style="font-family: "arial"; font-size: 14px; vertical-align: middle; margin: 0; padding: 9px 0;">' + plan + '</td><td style="font-family: "arial"; font-size: 14px; vertical-align: middle; margin: 0; padding: 9px 0;"  align="right">€ ' + amount + '</td></tr><tr class="total"> <td style="font-family: "arial"; font-size: 14px; vertical-align: middle; border-top-width: 1px; border-top-color: #f6f6f6; border-top-style: solid; margin: 0; padding: 9px 0; font-weight:bold;" width="80%">Total</td><td style="font-family: "arial"; font-size: 14px; vertical-align: middle; border-top-width: 1px; border-top-color: #f6f6f6; border-top-style: solid; margin: 0; padding: 9px 0; font-weight:bold;" align="right">€ ' + amount + '</td></tr></tbody></table></div></td></tr><tr><td colspan="2"><center></center><b>- Thanks Studyinbudapest</b> </td></tr></tbody></table></div><div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px"><p> Powered by Goziex Technologies Limited.<br> If you have any questions regarding this invoice please contact <a href="http://help.studyinbudapest.com">support<a/></p></div></div></div></body>'
        };

        // send mail with defined transport object
        transporter.sendMail(invoice, (error, info) => {
            if (error) {
                //res.send(500);
                return console.log(error);
            } else {
                res.sendStatus(200);
            }
            //console.log('Message sent: %s', info.messageId);
            //console.log(invoice);
        });
    });

    //Handle Contact Message to Student
    goziextech.post('/message', ensurePostPutDeleteIsAuthorized, ensureAuthenticated, function (req, res, next) {
        //Declare Variables
        var stdntfnmae = req.body.first_name;
        var stdntlname = req.body.last_name;
        var stdntcourse = req.body.course;
        var stdntuniversity = req.body.university;
        var stdnteml = req.body.email;
        var uvrstynm = req.body.university;
        var uvstem = req.body.university_email;
        var message = req.body.message;
        var applicationportal = req.body.applicationportal;
        var plaintext = uvrstynm + ' sent you a message: ' + message;

        let unimessageSentToStudent = {
            from: '"Studyinbudapest Mobile App" <admissions@studyinbudapest.com', // sender address
            to: stdnteml, // list of receivers
            subject: uvrstynm + ' sent you a message',
            text: plaintext, // plain text body
            html: '<body style="margin:0px; background: #f8f8f8;"><div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;"><div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 0px"><tbody><tr><td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="http://www.studyinbudapest.com" target="_blank"><img src="http://www.studyinbudapest.com/images/study-in-budapest-mobile-app-icon-study-abroad-european-universities-round.png" alt="Studyinbudapest" style="border:none; display:block; width:10%"></td></tr></tbody></table><center><div style="background:#grey; padding:20px; color:black;"><div style="background-color:red; color:white; width:25px; height:25px; border-radius:20px; display:inline-block; margin-right:5px;"><center>1</center></div> Message for ' + stdntfnmae + ' ' + stdntlname + '</div> </center><div style="padding: 40px; background: #fff;"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;"><tbody><tr><td>You have unread message from <b>' + uvrstynm + '</b></td><td align="left" width="100"></td></tr><tr><td colspan="2" style="padding:20px 0; border-top:1px solid #f6f6f6;"><div><table width="100%" cellpadding="0" cellspacing="0"><tbody><tr><div style="font-family:"verdana"; font-size: 15px; background:#F9F9FC; color:black; line-height: normal;"><p>' + message + '</p></div></tr><tr class="total"><td style="font-family: "arial"; font-size: 14px; vertical-align: middle; border-top-width: 1px; border-top-color: #f6f6f6; border-top-style: solid; margin: 0; padding: 9px 0;" width="80%"><center><a href="mailto:' + uvstem + '" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; color: #fff; background: #1e88e5; border-radius: 60px; text-decoration:none;"> Reply Message</a></center></td></tbody></table></div></td></tr><tr><td colspan="2"><center></center><b>- Thanks Studyinbudapest<br><center><a href="http://www.studyinbudapest.com/download-api"><img src="http://www.studyinbudapest.com/images/emailassets/applegoole.png" alt="Studyinbudapest" style="border:none; display:block; width:60%"></a></center></b> </td></tr></tbody></table></div><center><div style="margin-top:20px"><a href="https://www.facebook.com/studyingbudapest"><img src="http://localhost:3000/plugins/images/Facebook-Icon-Circle-Outline-Grey.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a><a href="tel:+12019921664"><img src="http://localhost:3000/plugins/images/if_phone_281830.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%; "></a><a href="https://www.instagram.com/studyinbudapst"><img src="http://localhost:3000/plugins/images/if_instagram_281827.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a><a href="https://twitter.com/studyinbudapst"><img src="http://localhost:3000/plugins/images/if_twitter_281833.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a><a href="https://www.youtube.com/channel/UCxVJxK_vB8Oi5fqUFU8-I4g?view_as=subscriber"><img src="http://localhost:3000/plugins/images/if_youtube_281826.png" alt="Studyinbudapest" style="border:none; display:inline-block; width:10%;"></a></div></center><div style="text-align: center; font-size: 12px; color: #b2b2b5; line-height: normal;"><p> Powered by Goziex Technologies Limited </p><p>This email was intended for ' + stdntfnmae + ' ' + stdntlname + '  (' + stdntcourse + ' at ' + stdntuniversity + '). <a href="http://help.studyinbudapest.com">Learn why you are recieving this message </a> </p><p> © Study in Budapest, Study in Europe, is a registered business of Goziex Technologies LLC Company.</p></div></div></div></body>'
        };

        transporter.sendMail(unimessageSentToStudent, (error, info) => {
            if (error) {
                //res.send(500);
                return console.log(error);
            } else {
                res.sendStatus(200);
            }
            //console.log('Message sent: %s', info.messageId);
            //console.log(mailOptions);
        });
    });
   


    process.on('uncaughtException', function (err) {
        return console.log(err);
    });

    goziextech.listen(3000);
    console.log('Goziex Tech Server is running on port:' + port);