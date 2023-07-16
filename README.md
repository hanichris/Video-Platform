# Video Platform Project
The Video Platform project is a comprehensive video-sharing web platform developed using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The project aims to provide a robust solution for individuals and companies to host and manage their videos securely on any cloud platform, with advanced authentication and permission management features.

## Motivation
The motivation behind this project was to create a versatile video platform that allows organizations, small businesses, and individuals to have complete control over their video content in storing and managing their private and/or sensitive videos. The project addresses the need for a customizable solution that supports various cloud platforms while offering seamless management of video resources, and easy sharing.

## Key Features
The project encompasses a range of features and technologies, including:

- REST API: The project implements a RESTful API architecture to facilitate smooth communication between the frontend and backend components.
- MVC Architecture Model: The project follows the Model-View-Controller (MVC) architectural pattern, promoting separation of concerns and maintainability.
- OAuth & Authentication: The authentication system ensures secure user management by supporting OAuth and incorporating robust authentication mechanisms.
- Caching: Caching techniques are employed to optimize performance and reduce the load on the server, resulting in faster response times.
- Rate Limiting: The application utilizes rate limiting mechanisms to prevent abuse and ensure fair usage of resources.
- Video Streaming: The platform enables efficient video streaming, allowing users to watch videos seamlessly without interruptions.
- Video Download: Users can download videos from the platform for offline viewing or storage purposes.
- Video Processing: The project handles video processing tasks such as generating thumbnails and transcoding videos into different formats to accommodate various devices and resolutions.
- Web Workers and Websockets (In Progress ⏳): The project is actively exploring the implementation of web workers and websockets to enhance real-time interactivity and improve the user experience.
- Cloud Integrations (Planned ⏳): Future enhancements include integrating with popular cloud platforms other than AWS like GCP, and Azure to provide users with flexibility in choosing their preferred cloud storage solution.
- Comprehensive Tests (Planned ⏳): The project aims to establish a robust testing framework to ensure code quality and prevent regressions.


## Challenges and Strengths
During the development of the Video Platform project, several challenges and strengths were identified:

##### Challenges:
- Configuring authentication, authorization, permissions, and roles management: Implementing a robust user management system with Oauth and JWT-based authentication and authorization proved to be challenging.
- Handling video processing tasks: Video processing, including thumbnail generation and transcoding, presented technical complexities that required careful implementation and consideration of security, performance and scalability.

##### Successes:
- Proficiently developed a REST API with well-defined endpoints and efficient data retrieval and manipulation mechanisms.
- Emphasis on security: The project prioritizes secure user management, ensuring that only authorized users have access to videos and resources.
- Scalability and performance optimization: Techniques such as caching, rate limiting, and efficient video streaming contribute to optimal performance and scalability of the platform.

## Technologies Used
The Video Platform project utilizes the following technologies:

- MongoDB: A flexible and scalable NoSQL database for storing video metadata, user information, and other relevant data.
- Express.js: A powerful web application framework for Node.js that simplifies the development of robust and scalable APIs.
- Node.js: A JavaScript runtime environment that enables server-side execution of JavaScript code, facilitating the backend functionalities.
- React.js: A popular JavaScript library for building user interfaces, used to develop the frontend components of the Video Platform project.
The project combines these technologies to provide a comprehensive and efficient video platform solution.

## Core Contributors
[Chris Nyambane](https://github.com/hanichris)
[Emmanuel Chalo](https://github.com/Chalo1996)
[Nick Nyanjui](https://github.com/n1klaus)

© 2023
