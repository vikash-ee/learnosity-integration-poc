// Copyright (c) 2021 Learnosity, Apache 2.0 License
//
// Basic example of loading a standalone assessment in a web page using Items API
// with `rendering_type: "assess"`.
'use strict';

// Include server side Learnosity SDK, and set up variables related to user access.
const Learnosity = require('../index'); // Include Learnosity SDK constructor
const config = require('../config'); // Load consumer key & secret from config.js
const uuid = require('uuid');        // Load the UUID library
const express = require('express');  // Load 'Express.js", a web server
const app = express();               // Instantiate the web server

app.set('view engine', 'ejs');       // Set EJS as our templating language

// - - - - - - Learnosity server-side configuration - - - - - - //

// Generate the user ID and session ID as UUIDs, set the web server domain.
const user_id = uuid.v4();
const session_id = uuid.v4();
const domain = 'localhost';

app.get('/', function (req, res) {
    res.render('combined', {}); // Render the page and request.
});

app.get('/author', function (req, res) {
    const learnositySdk = new Learnosity(); // Instantiate the SDK
    // Reports API configuration parameters.
    const request = learnositySdk.init(
        'author',                              // Select Author API
        // Consumer key and consumer secret are the public & private security keys required to access Learnosity APIs and data. These keys grant access to Learnosity's public demos account. Learnosity will provide keys for your own account.
        {
            consumer_key: config.consumerKey, // Load key from config.js
            domain: domain                   // Set the domain (from line 20)
        },
        config.consumerSecret,                // Load secret from config.js
        // simple api request object for item list view
        {
            mode: 'item_list',
            config: {
                item_edit: {
                    item: {
                        reference: {
                            show: true,
                            edit: true
                        },
                        dynamic_content: true,
                        shareed_passage: true,
                        enable_audio_recording: true
                    }
                }
            },
            user: {
                id: 'demos-site',
                firstname: 'Demos',
                lastname: 'User',
                email: 'demos@learnosity.com'
            }
        }
    );
    res.render('author', { request }); // Render the page and request.
});

app.get('/activity', function (req, res) {
    const learnositySdk = new Learnosity(); // Instantiate the SDK
    // Reports API configuration parameters.
    const request = learnositySdk.init(
        'author',                              // Select Author API
        // Consumer key and consumer secret are the public & private security keys required to access Learnosity APIs and data. These keys grant access to Learnosity's public demos account. Learnosity will provide keys for your own account.
        {
            consumer_key: config.consumerKey, // Load key from config.js
            domain: domain                   // Set the domain (from line 20)
        },
        config.consumerSecret,                // Load secret from config.js
        // simple api request object for item list view
        {
            mode: 'activity_list',
            user: {
                id: 'demos-site',
                firstname: 'Demos',
                lastname: 'User',
                email: 'demos@learnosity.com'
            }
        }
    );
    res.render('activity', { request }); // Render the page and request.
});

app.get('/assess/:activity_id', function (req, res) {
    const learnositySdk = new Learnosity(); // Instantiate the SDK
    // Items API configuration parameters.
    const request = learnositySdk.init(
        'items',                              // Select Items API
        // Consumer key and consumer secret are the public & private security keys required to access Learnosity APIs and data. These keys grant access to Learnosity's public demos account. Learnosity will provide keys for your own account.
        {
            consumer_key: config.consumerKey, // Load key from config.js
            domain: domain                   // Set the domain (from line 20)
        },
        config.consumerSecret,                // Load secret from config.js
        {
            // Unique student identifier, a UUID generated on line 18.
            user_id: user_id,
            // A reference of the Activity to retrieve from the Item bank, defining which Items will be served in this assessment.
            activity_template_id: req?.params?.activity_id ?? 'places_to_visit',
            // Selects a rendering mode, `assess` type is a "standalone" mode (loading a complete assessment player for navigation, VS `inline`, for embedded).
            // Uniquely identifies this specific assessment attempt session for  save/resume, data retrieval and reporting purposes. A UUID generated on line 18.
            session_id: session_id,
            // Used in data retrieval and reporting to compare results with other users submitting the same assessment.
            activity_id: req?.params?.activity_id ?? 'places_to_visit',
            // Selects a rendering mode, `assess` type is a "standalone" mode (loading a complete assessment player for navigation, VS `inline`, for embedded).
            rendering_type: 'assess',
            // Selects the context for the student response storage `submit_practice` mode means student response storage in the Learnosity cloud, for grading.
            type: 'submit_practice',
            // Human-friendly display name to be shown in reporting.
            name: 'Items API Quickstart',
            // Can be set to `initial, `resume` or `review`. Optional. Default = `initial`.
            state: 'initial'
        }
    );

    res.render('assess', { request }); // Render the page and request.
});

app.get("/reports", function (req, res) {
	const learnositySdk = new Learnosity(); // Instantiate the SDK
	// Reports API configuration parameters.
	const request = learnositySdk.init(
		"reports", // Select Reports API
		// Consumer key and consumer secret are the public & private security keys required to access Learnosity APIs and data. These keys grant access to Learnosity's public demos account. Learnosity will provide keys for your own account.
		{
			consumer_key: config.consumerKey, // Load key from config.js
			domain: domain, // Set the domain (from line 20)
		},
		config.consumerSecret, // Load secret from config.js
		{
			// Reports array to specify the type(s) of the reports to load on the page. This example uses one report type for simplicity, but you can specify multiple report types.
			reports: [
				{
					id: "activity-summary-by-group-report",
					type: "activity-summary-by-group",
					dataset_id: "33285a4b-0e6e-47e4-bade-78999ada14db",
					group_path: [],
					always_show_group_ancestors: true,
					columns: [
						{
							type: "group_name",
							label: "District",
						},
						{
							type: "numeric",
							field: "population",
							label: "# of Students",
						},
						{
							type: "1d_plot",
							label: "Results",
							elements: [
								{
									type: "shading_plot",
									source: "ancestor_1",
									min: "p25_percent",
									max: "p75_percent",
								},
								{
									type: "line_plot",
									source: "row",
									score: 50,
									label: false,
								},
								{
									type: "whisker_plot",
									source: "row",
									min: "lowest_percent",
									max: "highest_percent",
									labels: true,
								},
								{
									type: "box_plot",
									source: "row",
									min: "p25_percent",
									middle: "median_percent",
									max: "p75_percent",
									labels: true,
								},
							],
						},
					],
					user_columns: [
						{
							type: "user_id",
						},
						{
							type: "numeric",
							field: "score",
						},
						{
							type: "1d_plot",
							label: "Results",
							elements: [
								{
									type: "shading_plot",
									source: "ancestor_1",
									min: "p25_percent",
									max: "p75_percent",
								},
								{
									type: "line_plot",
									source: "row",
									score: 50,
									label: false,
								},
								{
									type: "score_plot",
									shape: "circle",
									source: "row",
									percent: ["score", "max_score"],
								},
							],
						},
					],
				},
			],
		}
	);
	res.render("reports", { request }); // Render the page and request.
});

app.listen(3000, function () { // Run the web application. Set the port here (3000).
    console.log('Example app listening on port 3000!');
});

// Note: for further reading, the client-side web page configuration can be found in the EJS template: 'docs/quickstart/views/standalone-assessment.ejs'. //
