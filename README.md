English | [简体中文](README_zh.md)


# 🤑 EnergyOne
> EnergyOne is an energy management platform designed for monitoring, analyzing, and optimizing corporate energy usage. By collecting and analyzing real-time data, it helps businesses reduce energy costs, enhance efficiency, and meet environmental requirements.

<b>Live Demo Address👉：[To be added after development](https://)</b>


# ✨ Project Highlights
1. User-friendly experience with meticulous attention to detail, aiming to replicate a desktop application experience.
2. Comprehensive functionality, supporting most common device elements and features, AI operation, and basic mobile editing and preview.

# 👀 Important Notes
1. This project is a "Web Backend Management Application," not a "low-code platform," "hardware editor," or "whiteboard application."
2. The target audience for this project includes factories, businesses, parks, energy service providers, governments, and public institutions with a need for **refined energy management**. The provided link is merely a demonstration address and does not offer any online services.
3. This document summarizes some [Frequently Asked Questions](/doc/Q&A.md). It is essential to review this document before submitting Issues and PRs for the first time.

# 🚀 Getting Started
```
npm install

npm run serve
```
Access in browser: http://127.0.0.1:8080/

## 📚 System Modules and Page Design
### 1. Dashboard (Energy Monitoring and Statistics Overview Module)
- **Features**:
  - Displays statistics for electricity, water, steam, and natural gas usage for yesterday, this month, and this year.
  - Shows daily usage trend charts.
  - Displays charts for electricity usage distribution (production, non-production, auxiliary electricity).
- **Design Highlights**:
  - Uses card format to display key indicators (KPIs).
  - Provides quick navigation to detailed pages.
  - Employs intuitive charts and color coding.
- **User Actions**:
  - Users are directed to the dashboard upon login for a quick overview of overall energy usage.
  - Clicking on specific KPI cards redirects users to detailed analysis pages.

### 2. Monitoring Page (Equipment Monitoring and Analysis Module)
- **Features**:
  - Displays equipment wiring diagrams.
  - Shows real-time energy consumption data for key equipment.
  - Provides historical electrical parameter comparisons.
  - Displays equipment usage trend charts for the same period and previous periods.
- **Design Highlights**:
  - Offers equipment lists and filtering functions.
  - Real-time data is displayed via dynamic charts.
  - Abnormal data is highlighted.
- **User Actions**:
  - Users can select specific equipment from the equipment list to view detailed data.
  - Supports filtering data by equipment type, time, and other dimensions.

### 3. Analysis Page (Energy Efficiency Analysis and Benchmarking Module)
- **Features**:
  - Displays energy consumption data for the entire factory and each sub-factory.
  - Shows trend charts for production volume and specific energy consumption.
  - Statistics for electricity, water, gas, steam, and carbon emissions.
  - Provides electricity safety analysis.
  - Offers electricity consumption forecasting and demand forecasting.
  - Provides power factor analysis.
- **Design Highlights**:
  - Offers multi-dimensional data filtering (time, equipment, energy type).
  - Optimization suggestions are displayed in card format.
  - Supports exporting analysis reports.
- **User Actions**:
  - Users can select specific time periods or equipment to view analysis results using the filtering function.
  - Clicking on optimization suggestion cards allows users to view detailed suggestions and operation guides.

### 4. Reporting Page (Meter Reading and Report Management Module)
- **Features**:
  - Supports meter reading management for electricity, water, natural gas, compressed air, and steam.
  - Provides customizable report configuration.
  - Displays report overviews and queries.
- **Design Highlights**:
  - Offers report templates and customization options.
  - Supports exporting to Excel, PDF, and other formats.
  - Report lists support filtering and sorting.
- **User Actions**:
  - Users can quickly generate standard reports using report templates.
  - Supports customizing reports to meet specific needs.
  - Supports filtering reports by time, equipment, and other dimensions.

### 5. Alert Page (Alerts and Notifications Module)
- **Features**:
  - Displays statistics for alert levels.
  - Shows the proportion of different alert types.
  - Displays alert rankings.
  - Provides alert message lists and details.
- **Design Highlights**:
  - Real-time alert notifications.
  - Tracks alert processing status.
  - Supports setting alert thresholds.
- **User Actions**:
  - Users can view alert messages in real-time and respond quickly to abnormal situations.
  - Supports filtering alert messages by alert type, time, and other dimensions.

### 6. System Settings Page (System Management Module)
- **Features**:
  - User management (adding, deleting users, setting permissions).
  - KPI management (defining upper and lower limits for KPIs).
  - Alert level settings (defining alert levels).
  - Cost pricing management (setting peak, shoulder, valley, and special period prices).
  - View and archive management (equipment台账 and equipment configuration maintenance).
- **Design Highlights**:
  - Provides a simple form and configuration interface.
  - Supports batch operations and import/export functions.
- **User Actions**:
  - System administrators can use this page for system configuration and management.
  - Supports adjusting system parameters and user permissions as needed.

## 🎗 User Experience and Interaction Design
- **Top Navigation Bar**:
  - Dashboard
  - Monitoring
  - Analysis
  - Reporting
  - Alerts
  - System Settings
- **Sidebar** (Optional):
  - Quick access to frequently used functions.
  - User information and notifications.
- **Search Function**:
  - Supports searching by equipment, energy type, time, and other keywords.
- **Filter Function**:
  - Each page provides filtering options to help users quickly locate the required data.

## 🎯 Development
Currently, there is no complete development documentation, but the following documents will be supplemented during the development process to provide some assistance for future development:
[To be added during development]()
<!-- - [Project Directory and Data Structure](/doc/.md)-->

## 📄 Copyright and Open Source License
[AGPL-3.0 License](/LICENSE) | Copyright © 2020-PRESENT [iluosonglin](https://github.com/iluosonglin)

## 🧮 Commercial Use
- This project prohibits closed-source commercial use. If you wish to use EnergyOne for commercial profit, please respect open source and **strictly adhere to the [AGPL-3.0 License](https://www.gnu.org/licenses/agpl-3.0.html)** to give back to the open source community.
- If, for any reason, you must close-source for commercial use and cannot comply with the AGPL-3.0 License, you can choose:
    1. Become an important contributor to the project (violating the license first and then becoming a contributor is not within the scope), including:
        - Your code is cited as a dependency in this project, including: npm installation, script/style file citations, code snippet citations (with proper attribution);
        - You have submitted important PRs to this project that have been merged (subjective judgment by the author);
        - You have long-term participation in the maintenance/advancement of this project, such as providing effective peripheral tools, creating numerous templates, etc. (subjective judgment by the author);
    3. Contact the [project owner](iluosonglin@gmail.com) via email to obtain an independent commercial license. Independent license pricing:
        - 1 year: $1999 ($2599 with electronic invoice)
        - 3 years: $2999 ($3999 with electronic invoice)
        - Permanent: $5499 ($7499 with electronic invoice)
- Please note the following regarding paid independent commercial licenses:
    - An independent commercial license means that you are separately authorized to use the code for commercial activities without the need to comply with the AGPL-3.0 License.
    - No additional "premium versions" or technical support is provided, nor is a ready-to-deliver product offered.
    - If needed, related backend logic and current template data can be provided.
    - Please conduct thorough research in advance to determine whether this project meets your requirements (both functionally and development-wise).

---
# 🔔 Other Notes
## What is the AGPL-3.0 License
The core requirements of the license are explained in layman's terms as follows:
- **Open Source Obligation**: If you use code under the AGPL license, regardless of how you or your downstream users modify or utilize it, you must publicly disclose the complete final code (not just the modified parts) and continue to open source it under the AGPL license, maintaining the传染性 of open source.
- **Network Services Must Also Be Open Source**: Even if you use AGPL-licensed code to create a website or network service, you must comply with the above **open source obligation** when others access your service over the network.
- **Retain Copyright Notices**: You must not delete the original author information and license statements in the code and must inform users of the code's origin.
- **No Additional Restrictions**: You must not impose additional restrictions on AGPL-licensed code, such as preventing others from redistributing it or requiring payment for its use.
- **Disclaimer**: The author does not guarantee the code is bug-free and is not liable for any consequences of its use.

For the detailed license content, please refer to the official documentation: [AGPL-3.0 License](https://www.gnu.org/licenses/agpl-3.0.html)

## Feedback
- For feature requests, bug reports, or technical inquiries, please use [Issues](https://github.com/iluosonglin/PPTist/issues) instead of email.
- Ensure the content of your issue is not already present in [Issues](https://github.com/pipipi-pikachu/PPTist/issues) (especially pinned Issues) or the [Frequently Asked Questions](/doc/Q&A.md).