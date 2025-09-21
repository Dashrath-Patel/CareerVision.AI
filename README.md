# 🚀 CareerVision.AI# CareerVision.ai 🚀



**AI-Powered Gamified Career Development Platform**Welcome to **CareerVision.ai**, a web application designed to guide users in their career journey by predicting suitable job roles, providing personalized learning paths, and offering recent job and internship opportunities. 🎯



CareerVision.AI is a comprehensive career development platform that combines artificial intelligence, gamification, and personalized learning to help users accelerate their professional growth.



![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)

![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)https://github.com/user-attachments/assets/26824c9b-b59d-407d-92de-30831e79d7d0

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python)

![Django](https://img.shields.io/badge/Django-4.2-092E20?style=for-the-badge&logo=django)



## ✨ Features

## Features 🌟

### 🤖 AI-Powered Assessment

- **Adaptive Question Generation**: Dynamic questions based on user profile and domain expertise- **AI-Powered Job Role Prediction**: Utilizes a Deep Learning-based Multi-Layer Perceptron (MLP) classifier to suggest job roles tailored to user inputs.

- **Real-time Analysis**: Instant skill assessment with detailed breakdowns- **Personalized Learning Paths**: Recommends courses and resources to bridge skill gaps and enhance career prospects.

- **Personalized Feedback**: AI-generated recommendations and career guidance- **Real-Time Job Listings**: Fetches the latest job and internship opportunities using the Adzuna API.



### 🎮 Gamified Learning Experience## Tech Stack 🛠️

- **Interactive Roadmaps**: Step-by-step learning paths with visual milestones

- **Achievement System**: Badges, points, and rewards for completed objectives- **Backend**: Django

- **Progress Tracking**: Visual progress bars and completion statistics- **Frontend**: HTML, CSS, Tailwind CSS (via CDN)

- **Daily Challenges**: Engaging tasks to maintain learning momentum- **Machine Learning**: Deep Learning with MLP Classifier

- **Job Listings**: Adzuna API

### 📄 Resume Analysis

- **AI-Powered Analysis**: Comprehensive resume evaluation using advanced NLP## Installation Guide 📝

- **Skill Gap Identification**: Detailed analysis of current vs required skills

- **ATS Optimization**: Applicant Tracking System compatibility scoringFollow these steps to set up the project locally:

- **Improvement Recommendations**: Actionable suggestions for resume enhancement

1. **Clone the Repository**:

### 📚 Personalized Learning Resources

- **AI-Curated Content**: Learning resources tailored to individual skill gaps   ```bash

- **Multi-Format Support**: Videos, courses, tutorials, books, and certifications   git clone https://github.com/Rahul4112002/CareerVision.ai.git

- **Provider Integration**: Resources from top platforms like Coursera, Udemy, freeCodeCamp   cd CareerVision.ai

- **Smart Filtering**: Advanced search and filtering capabilities   ```



### 🔥 Daily Engagement System2. **Set Up Virtual Environment**:

- **Motivation Hub**: Daily quotes, tips, and challenges

- **Streak Tracking**: Learning consistency monitoring and rewards   ```bash

- **Smart Reminders**: Personalized notifications for goals and milestones   python -m venv env

- **Progress Insights**: Trend analysis and achievement tracking   source env/bin/activate  # On Windows: env\Scripts\activate

   ```

## 🛠 Tech Stack

3. **Install Dependencies**:

### Frontend

- **Next.js 15** - React framework with App Router   ```bash

- **TypeScript** - Type-safe development   pip install -r requirements.txt

- **Tailwind CSS** - Utility-first styling   ```

- **Framer Motion** - Smooth animations and interactions

- **Lucide React** - Modern icon library4. **Apply Migrations**:



### Backend   ```bash

- **Django 4.2** - Python web framework   python manage.py migrate

- **Django REST Framework** - API development   ```

- **SQLite/PostgreSQL** - Database options

- **Python 3.10+** - Core backend language5. **Run the Development Server**:



### AI Integration   ```bash

- **Google Gemini AI** - Advanced language model for content generation   python manage.py runserver

- **Natural Language Processing** - Text analysis and understanding   ```

- **Machine Learning** - Personalization and recommendations

   Access the application at `http://127.0.0.1:8000/`.

## 🚀 Quick Start

## File Structure 📂

### Prerequisites

- Node.js 18+ and npm/yarn```

- Python 3.10+ and pipCareerVision.ai/

- Git├── jobroleprediction/

│   ├── migrations/

### Frontend Setup│   ├── __init__.py

│   ├── admin.py

```bash│   ├── apps.py

# Clone the repository│   ├── models.py

git clone https://github.com/Dashrath-Patel/CareerVision.AI.git│   ├── tests.py

cd CareerVision.AI│   └── views.py

├── templates/

# Navigate to Next.js project├── static/

cd career-vision-next├── rbl_ann.ipynb

├── student_placement_data.csv

# Install dependencies└── manage.py

npm install```



# Create environment file## Usage Instructions 📚

cp .env.example .env.local

1. **Navigate to the Home Page**: Explore the intuitive user interface built with Tailwind CSS via CDN.

# Add your API keys2. **Input Your Details**: Provide necessary information to receive job role predictions.

GEMINI_API_KEY=your_gemini_api_key_here3. **Review Recommendations**: Explore suggested job roles, learning paths, and current job listings.

GEMINI_MODEL=gemini-1.5-flash

## Contributing 🤝

# Start development server

npm run devWe welcome contributions! Please fork the repository and create a pull request with your proposed changes.

```



### Backend Setup## Acknowledgements 🙏



```bash- **Django-Tailwind Integration**: Using Tailwind via CDN for seamless styling.

# Navigate to Django project- **Adzuna API**: Job data powered by [Adzuna](https://developer.adzuna.com/).

cd ..

## Contact 📩

# Create virtual environment

python -m venv venvFor questions or feedback, please open an issue in this repository.

source venv/bin/activate  # On Windows: venv\Scripts\activate


# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start Django server
python manage.py runserver
```

## 📊 Project Structure

```
CareerVision.AI/
├── career-vision-next/          # Next.js Frontend
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   ├── components/          # React components
│   │   ├── services/            # API services
│   │   └── lib/                 # Utilities
│   ├── public/                  # Static assets
│   └── package.json
├── jobroleprediction/           # Django Backend
├── prediction/                  # Django App
├── media/                       # Uploaded files
├── requirements.txt             # Python dependencies
├── manage.py                    # Django management
└── README.md
```

## 🎯 Key Components

### AI Services (`/src/services/gemini-ai.ts`)
- Question generation
- Assessment analysis  
- Roadmap creation
- Resume analysis
- Daily engagement content

### API Routes (`/src/app/api/`)
- `/generate-questions` - Dynamic question creation
- `/analyze-assessment` - Skill evaluation
- `/generate-gamified-roadmap` - Personalized learning paths
- `/analyze-resume` - Resume analysis
- `/recommend-resources` - Learning resource curation
- `/daily-engagement` - Motivation and tracking

## 🔧 Environment Variables

Create `.env.local` in the `career-vision-next` directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful language model capabilities
- **Next.js Team** for the excellent React framework
- **Vercel** for seamless deployment platform
- **Open Source Community** for amazing tools and libraries

---

**Made with ❤️ by [Dashrath Patel](https://github.com/Dashrath-Patel)**

⭐ Star this repository if you find it helpful!