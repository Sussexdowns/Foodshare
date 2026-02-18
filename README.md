# Foodshare

An interactive community tool that maps free, public food sources to reduce urban waste and fight food insecurity.

## 🎯 Project Overview

Foodshare addresses the paradox of urban food waste: while food insecurity rises, thousands of pounds of fresh produce rot on public trees and bushes. This project is unique because it moves beyond a static map—it is a community-managed ecosystem integrated with Facebook Groups to ensure data accuracy and local trust.

**Project Logline:** An interactive community tool that maps free, public food sources to reduce urban waste and fight food insecurity. It empowers users to discover, share, and sustain local foraging ecosystems through real-time data.

## 📽️ Presentation

**[View the Full Presentation →](https://sussexdowns.github.io/Foodshare/presentation/index.html)**

### Presentation Preview

The presentation showcases the Foodshare concept with slides covering:
- Project introduction and vision
- The challenge of food waste vs food insecurity
- Our solution and approach
- Technical implementation details
- Impact and sustainability goals

## 🌍 UN Sustainable Development Goals

Foodshare aligns with the following UN SDGs:

- **Zero Hunger** (SDG 2) - Providing a free, real-time directory of nutrition
- **Sustainable Cities and Communities** - Promoting urban "edible landscapes"
- **Responsible Consumption and Production** - Reducing food waste

## 🎮 Project Details

| Attribute | Details |
|-----------|---------|
| **Project Medium** | Game - Mobile, Interactive Design, AR (Future) |
| **Current Stage** | Production (Migrating from Web Demo to Unity) |
| **Target Reach** | United Kingdom (initial), Global (via open-source scaling) |

## 👤 Creator Information

- **Applicant:** Nigel Morris
- **Email:** nigel.morris@escg.ac.uk
- **Organization:** Sussex Downs / Foodshare Project
- **Website:** [https://sussexdowns.github.io/Foodshare/](https://sussexdowns.github.io/Foodshare/)
- **Location:** Lewes, England, United Kingdom

### Biography

I am the founder of Foodshare and an educator with eight years of experience teaching Unity at East Sussex College Group (ESCG), Lewes. Combining a background in web development with a passion for sustainability, I created the Foodshare prototype to bridge the gap between urban food waste and food insecurity. My role involves overseeing the technical architecture and Firebase integration while leading the transition from a web demo to a high-performance Unity application. The project is currently in production and part of a work experience programme for my students.

## 💡 Impact Summary

Foodshare aligns with SDG 2 (Zero Hunger) by providing a free, real-time directory of nutrition. Our call to action is simple: **"Harvest, Share, Log."**

Success is measurable through:
- User engagement metrics in our Firebase backend
- Number of active public food sites mapped
- Volume of community interactions within our linked Facebook Groups

By using Real-Time 3D (RT3D), we increase the "findability" of food, which is currently a barrier in 2D mapping.

## 🤝 Inclusion & Accessibility

Foodshare is built for the community, by the community. We recognise that those most affected by food insecurity often use older hardware or have limited data plans. Key accessibility features include:

- Performance optimisation for lower-end devices
- Robust "Offline Mode" for areas with limited connectivity
- Community management through local Facebook Groups
- Grassroots approach ensuring cultural relevance

## 🛠️ Technical Details

| Attribute | Details |
|-----------|---------|
| **Unity License** | Educational |
| **Unity Version** | 2022.3 LTS |
| **Previous Engine** | HTML5/JavaScript (Web Prototype) |
| **Target Hardware** | Standard iOS or Android smartphones |

### Unity Implementation

Unity is being used to transform our 2D web demo into a high-performance, cross-platform mobile application:

- **Unity UI Toolkit** for responsive interface
- **Addressables system** for offline data management
- **3D spatial view** for easier identification of trees/bushes in complex urban parks
- **AR Foundation** (planned) to overlay food location data onto camera feed

### Technical Challenges

1. Optimising rendering of thousands of food-source "pins" without compromising performance on older devices
2. Robust synchronisation between Firebase Realtime Database and Unity's local storage for seamless "Offline Mode"

## 📁 Project Structure

```
Foodshare/
├── Presentation/
│   ├── index.html          # Main presentation
│   ├── presentation.css    # Presentation styles
│   ├── presentation.js     # Presentation logic
│   └── *.webp              # Presentation images
├── scripts/                # JavaScript modules
├── css/                    # Stylesheets
├── images/                 # App images
└── index.html              # Main application
```

## 🔗 Links

- **Live Demo:** [https://sussexdowns.github.io/Foodshare/](https://sussexdowns.github.io/Foodshare/)
- **Presentation:** [View Presentation](Presentation/index.html)

---

*Foodshare - Making healthy food visible and accessible for everyone, regardless of economic status.*
