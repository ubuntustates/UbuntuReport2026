# UbuntuReport API

**Project Name:** UbuntuReport

**Author:** Adesina Olagunju ([daadesina1@gmail.com](mailto:daadesina1@gmail.com))

**Date:** 23 October 2025

---

## Table of Contents

- [UbuntuReport API](#ubuntureport-api)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
    - [News Articles](#news-articles)
    - [Categories](#categories)
  - [Celery \& Scheduled Tasks](#celery--scheduled-tasks)
  - [Models](#models)
    - [NewsArticle](#newsarticle)
  - [License](#license)

---

## Overview

**UbuntuReport** is a Django-based API designed to aggregate news articles from multiple international sources and provide users with fast access to news across various categories. It fetches news via RSS feeds, stores them in a database, and exposes searchable and filterable REST API endpoints.

---

## Features

* Fetch news from multiple sources:

  * BBC, CNN, Al Jazeera, The Guardian, Channels TV, Premium Times, Vanguard
* Categorized news articles
* Automatic deduplication of articles
* Searchable and filterable API endpoints
* Scheduled fetching of news every hour using Celery and Redis
* REST API with pagination

---

## Technologies

* Python 3.x
* Django 5.2
* Django REST Framework (DRF)
* Django Filters
* Celery (with Redis broker)
* SQLite (default, can be changed)
* Feedparser for RSS feed parsing

---

## Installation

1. Clone the repository:

```bash
git clone <repository_url>
cd emergency_news
```

2. Create a virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Apply migrations:

```bash
python manage.py migrate
```

5. Create a superuser (optional, for Django admin):

```bash
python manage.py createsuperuser
```

---

## Configuration

* **Database:** By default, the project uses SQLite. Update `DATABASES` in `emergency_news/settings.py` for PostgreSQL or other databases.
* **Celery:** Requires Redis. Update the broker URL in `emergency_news/celery.py` if needed:

```python
app = Celery('emergency_news', broker='redis://localhost:6379/0')
```

---

## Usage

1. Run the Django development server:

```bash
python manage.py runserver
```

2. Start Celery worker:

```bash
celery -A emergency_news worker -l info
```

3. Start Celery beat scheduler (for periodic fetching):

```bash
celery -A emergency_news beat -l info
```

4. Fetch news manually (optional):

```bash
python manage.py fetch_bbc_news
python manage.py fetch_cnn_news
# ... and others
```

---

## API Endpoints

### News Articles

| Method | Endpoint          | Description                                                    |
| ------ | ----------------- | -------------------------------------------------------------- |
| GET    | `/api/news/`      | List all news articles (paginated, searchable, and filterable) |
| GET    | `/api/news/{id}/` | Retrieve a single article by ID                                |

**Search & Filtering:**

* `search` query parameter: searches in `title`, `category`, `summary`, and `source`
* `category` query parameter: filters by category
* `source` query parameter: filters by news source

Example:

```
/api/news/?search=technology&category=world&source=BBC
```

---

### Categories

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| GET    | `/api/categories/` | List all unique categories |

---

## Celery & Scheduled Tasks

The project uses **Celery** for background tasks and scheduling. News fetching tasks are run every hour automatically:

| Task Name                 | Source        |
| ------------------------- | ------------- |
| `fetch_bbc_news`          | BBC           |
| `fetch_cnn_news`          | CNN           |
| `fetch_vanguard_news`     | Vanguard      |
| `fetch_aljazeera_news`    | Al Jazeera    |
| `fetch_guardian_news`     | The Guardian  |
| `fetch_channelstv_news`   | Channels TV   |
| `fetch_premiumtimes_news` | Premium Times |

---

## Models

### NewsArticle

| Field       | Type      | Description                  |
| ----------- | --------- | ---------------------------- |
| `id`        | AutoField | Primary key                  |
| `category`  | CharField | News category                |
| `title`     | CharField | News title                   |
| `link`      | URLField  | Unique link to the article   |
| `published` | DateTime  | Publication datetime         |
| `summary`   | TextField | Short summary of the article |
| `source`    | CharField | News source name             |

---

## License

This project is developed by **Adesina Olagunju**. All rights reserved.
