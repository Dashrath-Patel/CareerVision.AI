# CareerVision.ai - Gamified Career Development Platform

A comprehensive AI-powered career development platform with gamification features that enhance user engagement, motivation, and consistency in their learning journey.

## 🎮 Gamification Features

- **Points & Levels**: Earn points for completing activities and level up your profile
- **Badges & Achievements**: Unlock special badges and track multi-step achievements
- **Daily Challenges**: Complete daily learning tasks for bonus points
- **Weekly Quests**: Participate in weekly objectives for substantial rewards
- **Streak Tracking**: Maintain learning streaks for consistency rewards
- **Progress Analytics**: Detailed visualizations of your learning journey
- **Leaderboards**: Compete with other learners in your domain
- **Skill Mastery**: Track and improve individual skills with progress indicators
- **Interactive Roadmaps**: Visual career paths with gamified stage completion

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Advanced animations
- **Recharts**: Data visualization
- **Lucide React**: Icon library

### Backend
- **Django**: Python web framework
- **Django REST Framework**: API development
- **SQLite/PostgreSQL**: Database options
- **Python**: Core backend language

## 📁 Project Structure

```
CareerVision.ai/
├── career-vision-next/          # Next.js Frontend
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   ├── components/          # React components
│   │   │   └── gamification/    # Gamification UI components
│   │   ├── services/            # API and business logic
│   │   ├── types/               # TypeScript definitions
│   │   └── lib/                 # Utilities
│   └── public/                  # Static assets
├── prediction/                  # Django Backend
│   ├── models.py               # Database models
│   ├── views.py                # Main views
│   ├── gamification_views.py   # Gamification API views
│   ├── serializers.py          # API serializers
│   ├── admin.py                # Admin interface
│   ├── urls.py                 # URL routing
│   └── management/             # Django commands
└── media/                      # User uploads and static files
```

## 🚀 Quick Start

### 1. Backend Setup (Django)

```bash
# Navigate to project root
cd CareerVision.ai-main

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Populate gamification data
python manage.py populate_gamification_data

# Start Django server
python manage.py runserver
```

### 2. Frontend Setup (Next.js)

```bash
# Navigate to frontend directory
cd career-vision-next

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### 3. Environment Configuration

Create `.env.local` in the `career-vision-next` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENVIRONMENT=development
```

## 🎯 Key Components

### Gamification System

#### 1. **UserProfile** - Core user data
- Points, level, streaks
- Domain specialization
- Activity tracking

#### 2. **RoadmapStage** - Learning milestones
- Structured career paths
- Prerequisites and skills
- Points and difficulty levels

#### 3. **Badge System** - Achievement recognition
- Rarity levels (common to legendary)
- Unlock criteria
- Visual rewards

#### 4. **Achievement System** - Multi-step goals
- Progress tracking
- Category-based organization
- Point rewards

#### 5. **Challenge System** - Daily engagement
- Time-limited activities
- Variety of challenge types
- Bonus point opportunities

### Frontend Components

#### 1. **InteractiveRoadmap**
```typescript
// Animated roadmap visualization
<InteractiveRoadmap 
  domain="software_development"
  userId="user123"
  onStageSelect={handleStageSelect}
/>
```

#### 2. **GamificationDashboard**
```typescript
// Comprehensive progress dashboard
<GamificationDashboard 
  userId="user123"
  showBadges={true}
  showAchievements={true}
/>
```

#### 3. **ProgressVisualization**
```typescript
// Advanced analytics and charts
<ProgressVisualization 
  userId="user123"
  timeframe="weekly"
/>
```

### API Integration

#### Django API Service
```typescript
import { djangoGamificationAPI } from '@/services/django-gamification-api';

// Get user progress
const progress = await djangoGamificationAPI.getUserProgress('user123');

// Update progress
await djangoGamificationAPI.updateProgress('user123', {
  type: 'stage_completed',
  stage_id: 'programming_fundamentals'
});

// Get daily challenges
const challenges = await djangoGamificationAPI.getDailyChallenges('user123');
```

## 📊 API Endpoints

### User Management
- `GET/POST /api/gamification/profile/{user_id}/` - User profile
- `GET /api/gamification/progress/{user_id}/` - Comprehensive progress
- `POST /api/gamification/progress/{user_id}/update/` - Update progress

### Gamification Features
- `GET /api/gamification/roadmap/{domain}/stages/` - Domain stages
- `GET /api/gamification/challenges/{user_id}/` - Daily challenges
- `POST /api/gamification/challenges/{user_id}/{challenge_id}/complete/` - Complete challenge
- `GET /api/gamification/quest/{user_id}/` - Weekly quest
- `GET /api/gamification/badges/{user_id}/` - User badges
- `GET /api/gamification/leaderboard/` - Global leaderboard
- `GET /api/gamification/stats/{user_id}/` - Progress statistics

## 🎨 Customization

### Adding New Career Domains

1. **Create roadmap stages** in Django admin
2. **Update domain types** in TypeScript definitions
3. **Add domain-specific content** to roadmap data service

### Creating Custom Badges

1. **Design badge criteria** in Django admin
2. **Upload badge icons** to media folder
3. **Implement badge checking logic** in views

### Extending Achievements

1. **Define achievement steps** in Django models
2. **Create progress tracking logic** in views
3. **Update frontend achievement display**

## 🔧 Development Workflow

### Adding New Features

1. **Define TypeScript types** in `/types/gamification.ts`
2. **Create Django models** in `prediction/models.py`
3. **Implement API views** in `prediction/gamification_views.py`
4. **Add serializers** in `prediction/serializers.py`
5. **Create React components** in `/components/gamification/`
6. **Update service layer** for API integration

### Testing Strategy

- **Unit tests** for service functions
- **Integration tests** for API endpoints
- **Component testing** with React Testing Library
- **E2E testing** with Playwright/Cypress

## 📈 Analytics & Monitoring

### Built-in Analytics
- User progress tracking
- Skill development metrics
- Engagement analytics
- Learning pattern insights

### Performance Monitoring
- API response times
- Component render performance
- User interaction tracking
- Error monitoring

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
   ```env
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   DJANGO_SECRET_KEY=your-secret-key
   DATABASE_URL=your-production-db-url
   ```

2. **Database Migration**
   ```bash
   python manage.py migrate
   python manage.py populate_gamification_data
   python manage.py collectstatic
   ```

3. **Frontend Build**
   ```bash
   npm run build
   npm start
   ```

### Docker Deployment

```dockerfile
# Example Dockerfile for Django
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "jobroleprediction.wsgi:application"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join GitHub Discussions for questions
- **Wiki**: Comprehensive guides in the project wiki

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Social features (friend connections, team challenges)
- [ ] AI-powered personalized learning recommendations
- [ ] Integration with external learning platforms
- [ ] Advanced analytics dashboard
- [ ] Gamification for teams and organizations
- [ ] Certification tracking
- [ ] Mentorship system integration

---

## 🎮 Getting Started with Gamification

1. **Start your journey** by selecting a career domain
2. **Complete your first stage** to earn your first badge
3. **Maintain daily streaks** for consistency rewards
4. **Participate in challenges** for bonus points
5. **Track your progress** in the analytics dashboard
6. **Compete on leaderboards** with other learners
7. **Unlock achievements** by completing multi-step goals

Happy learning! 🚀