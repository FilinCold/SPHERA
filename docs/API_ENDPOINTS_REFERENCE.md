# API ENDPOINTS REFERENCE — SFERA LMS

Подробный справочник по всем ручкам из `docs/openapi.yaml` (OpenAPI 3.0.3).
Данные взяты только из спецификации, без дополнительных предположений.

Формат описания каждой ручки:

- **Method + Path**
- **Auth** (`jwtAuth` или без обязательного JWT)
- **Параметры** (`path`/`query`)
- **Request body** (схема)
- **Responses** (коды и схема, если указана)

---

## 1) Auth / Users

### `POST /api/v1/auth/token/`

- Auth: без обязательного JWT
- Параметры: нет
- Request body: `TokenObtainPair`
- Responses:
  - `200`: `TokenObtainPair`

### `POST /api/v1/auth/token/refresh/`

- Auth: без обязательного JWT
- Параметры: нет
- Request body: `TokenRefresh`
- Responses:
  - `200`: `TokenRefresh`

### `POST /api/v1/auth/token/verify/`

- Auth: без обязательного JWT
- Параметры: нет
- Request body: `TokenVerify`
- Responses:
  - `200`: `TokenVerify`

### `GET /api/v1/auth/me/`

- Auth: `jwtAuth`
- Параметры: нет
- Request body: нет
- Responses:
  - `200`: `UserRetrieveUpdate`

### `PUT /api/v1/auth/me/`

- Auth: `jwtAuth`
- Параметры: нет
- Request body: нет
- Responses:
  - `405`

### `PATCH /api/v1/auth/me/`

- Auth: `jwtAuth`
- Параметры: нет
- Request body: multipart form (inline schema в спецификации)
- Responses:
  - `200`: `UserRetrieveUpdate`

### `PUT /api/v1/auth/change-password/`

- Auth: `jwtAuth`
- Параметры: нет
- Request body: нет
- Responses:
  - `405`

### `PATCH /api/v1/auth/change-password/`

- Auth: `jwtAuth`
- Параметры: нет
- Request body: `ChangeUserPassword`
- Responses:
  - `200`: объект с `message`

### `PUT /api/v1/auth/reset-password/`

- Auth: `jwtAuth` или анонимно (`{}`)
- Параметры: нет
- Request body: нет
- Responses:
  - `405`

### `PATCH /api/v1/auth/reset-password/`

- Auth: `jwtAuth` или анонимно (`{}`)
- Параметры: нет
- Request body: `ResetUserPassword`
- Responses:
  - `200`: объект с `message`

### `GET /api/v1/auth/{registration_uuid}/`

- Auth: `jwtAuth` или анонимно (`{}`)
- Параметры:
  - `path`: `registration_uuid`
- Request body: нет
- Responses:
  - `200`: `SetUserPassword`

### `PUT /api/v1/auth/{registration_uuid}/`

- Auth: `jwtAuth` или анонимно (`{}`)
- Параметры:
  - `path`: `registration_uuid`
- Request body: нет
- Responses:
  - `405`

### `PATCH /api/v1/auth/{registration_uuid}/`

- Auth: `jwtAuth` или анонимно (`{}`)
- Параметры:
  - `path`: `registration_uuid`
- Request body: `SetUserPassword`
- Responses:
  - `200`: объект с `message`

---

## 2) Companies (пространства)

### `GET /api/v1/companies/`

- Auth: `jwtAuth`
- Параметры:
  - `query`: `limit`, `offset`, `ordering`, `search`
- Request body: нет
- Responses:
  - `200`: `PaginatedCompanyBriefList`

### `POST /api/v1/companies/`

- Auth: `jwtAuth`
- Параметры: нет
- Request body: `Company`
- Responses:
  - `201`: `Company`

### `GET /api/v1/companies/{slug}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `slug`
- Request body: нет
- Responses:
  - `200`: `CompanyDetail`

### `PUT /api/v1/companies/{slug}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `slug`
- Request body: нет
- Responses:
  - `405`

### `PATCH /api/v1/companies/{slug}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `slug`
- Request body: `Company`
- Responses:
  - `200`: `Company`

### `DELETE /api/v1/companies/{slug}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `slug`
- Request body: нет
- Responses:
  - `204`

---

## 3) Subscriptions

### `GET /api/v1/companies/{company_slug}/subscriptions/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`
  - `query`: `limit`, `offset`, `ordering`
- Request body: нет
- Responses:
  - `200`: `PaginatedSubscriptionList`

### `POST /api/v1/companies/{company_slug}/subscriptions/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`
- Request body: `Subscription`
- Responses:
  - `201`: `Subscription`

### `GET /api/v1/companies/{company_slug}/subscriptions/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`, `id`
- Request body: нет
- Responses:
  - `200`: `Subscription`

### `PUT /api/v1/companies/{company_slug}/subscriptions/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`, `id`
- Request body: нет
- Responses:
  - `405`

### `PATCH /api/v1/companies/{company_slug}/subscriptions/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`, `id`
- Request body: `Subscription`
- Responses:
  - `200`: `Subscription`

### `DELETE /api/v1/companies/{company_slug}/subscriptions/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`, `id`
- Request body: нет
- Responses:
  - `204`

---

## 4) Employees

### `GET /api/v1/companies/{company_slug}/employees/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`
  - `query`: `limit`, `offset`, `ordering`, `search`
- Request body: нет
- Responses:
  - `200`: `PaginatedEmployeesList`

### `POST /api/v1/companies/{company_slug}/employees/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`
- Request body: `Employees`
- Responses:
  - `201`: `Employees`

### `GET /api/v1/companies/{company_slug}/employees/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`, `id`
- Request body: нет
- Responses:
  - `200`: `Employees`

### `PUT /api/v1/companies/{company_slug}/employees/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`, `id`
- Request body: нет
- Responses:
  - `405`

### `PATCH /api/v1/companies/{company_slug}/employees/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`, `id`
- Request body: `Employees`
- Responses:
  - `200`: `Employees`

### `DELETE /api/v1/companies/{company_slug}/employees/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`, `id`
- Request body: нет
- Responses:
  - `204`

### `GET /api/v1/registration/{registration_uuid}/`

- Auth: `jwtAuth` или анонимно (`{}`)
- Параметры:
  - `path`: `registration_uuid`
- Request body: нет
- Responses:
  - `200`: `EmployeeFinalReg`

### `PUT /api/v1/registration/{registration_uuid}/`

- Auth: `jwtAuth` или анонимно (`{}`)
- Параметры:
  - `path`: `registration_uuid`
- Request body: нет
- Responses:
  - `405`

### `PATCH /api/v1/registration/{registration_uuid}/`

- Auth: `jwtAuth` или анонимно (`{}`)
- Параметры:
  - `path`: `registration_uuid`
- Request body: `EmployeeFinalReg`
- Responses:
  - `200`: `EmployeeFinalReg`

---

## 5) Courses

### `GET /api/v1/companies/{company_slug}/courses/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`
  - `query`: `limit`, `offset`
- Request body: нет
- Responses:
  - `200`: `PaginatedCourseList`

### `POST /api/v1/companies/{company_slug}/courses/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`
- Request body: `Course`
- Responses:
  - `201`: `Course`

### `GET /api/v1/companies/{company_slug}/courses/{course_uuid}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`, `course_uuid`
- Request body: нет
- Responses:
  - `200`: `Course`

### `PATCH /api/v1/companies/{company_slug}/courses/{course_uuid}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`, `course_uuid`
- Request body: `Course`
- Responses:
  - `200`: `Course`

### `DELETE /api/v1/companies/{company_slug}/courses/{course_uuid}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`, `course_uuid`
- Request body: нет
- Responses:
  - `204`

### `GET /api/v1/companies/{company_slug}/courses/{course_uuid}/info/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`, `course_uuid`
- Request body: нет
- Responses:
  - `200`: `DeletedAt`

### `DELETE /api/v1/companies/{company_slug}/courses/{course_uuid}/permanent/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`, `course_uuid`
- Request body: нет
- Responses:
  - `204`

### `PATCH /api/v1/companies/{company_slug}/courses/{course_uuid}/publish/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`, `course_uuid`
- Request body: нет
- Responses:
  - `200`

### `PATCH /api/v1/companies/{company_slug}/courses/{course_uuid}/restore/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`, `course_uuid`
- Request body: нет
- Responses:
  - `200`

### `GET /api/v1/companies/{company_slug}/courses/trash/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `company_slug`
  - `query`: `limit`, `offset`
- Request body: нет
- Responses:
  - `200`: `PaginatedCourseList`

### `GET /api/v1/courses/{course_uuid}/candidates/{candidate_id}/answers/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `course_uuid`, `candidate_id`
- Request body: нет
- Responses:
  - `200`: `CandidateAnswers`

---

## 6) Applications / Candidate Enrollment

### `GET /api/v1/courses/{course_uuid}/applications/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `course_uuid`
  - `query`: `limit`, `offset`, `ordering`
- Request body: нет
- Responses:
  - `200`: `PaginatedCourseCandidatesListList`

### `GET /api/v1/courses/{course_uuid}/applications/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `course_uuid`, `id`
- Request body: нет
- Responses:
  - `200`: `CourseCandidateDetail`

### `PUT /api/v1/courses/{course_uuid}/applications/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `course_uuid`, `id`
- Request body: нет
- Responses:
  - `405`

### `PATCH /api/v1/courses/{course_uuid}/applications/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `course_uuid`, `id`
- Request body: `CourseCandidateDetail`
- Responses:
  - `200`: `CourseCandidateDetail`

### `POST /api/v1/courses/{course_uuid}/candidate-enrollment/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `course_uuid`
- Request body: inline object (`email`)
- Responses:
  - `201`: inline object (`status`, `course_link`)
  - `200`: inline object (`status`, `course_link`)
  - `400`
  - `404`

---

## 7) Candidate Registration

### `POST /api/v1/candidate-registration/`

- Auth: `jwtAuth` (как указано в OpenAPI)
- Параметры: нет
- Request body: `CandidateReg`
- Responses:
  - `201`: `CandidateReg`

---

## 8) Lessons

### `GET /api/v1/courses/{course_uuid}/lessons/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `course_uuid`
  - `query`: `limit`, `offset`
- Request body: нет
- Responses:
  - `200`: `PaginatedLessonList`

### `POST /api/v1/courses/{course_uuid}/lessons/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `course_uuid`
- Request body: `Lesson`
- Responses:
  - `201`: `Lesson`

### `GET /api/v1/courses/{course_uuid}/lessons/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `course_uuid`, `id`
- Request body: нет
- Responses:
  - `200`: `Lesson`

### `PATCH /api/v1/courses/{course_uuid}/lessons/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `course_uuid`, `id`
- Request body: `Lesson`
- Responses:
  - `200`: `Lesson`

### `DELETE /api/v1/courses/{course_uuid}/lessons/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `course_uuid`, `id`
- Request body: нет
- Responses:
  - `204`

### `GET /api/v1/courses/{course_uuid}/lessons/{id}/info/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `course_uuid`, `id`
- Request body: нет
- Responses:
  - `200`: `DeletedAt`

### `DELETE /api/v1/courses/{course_uuid}/lessons/{id}/permanent/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `course_uuid`, `id`
- Request body: нет
- Responses:
  - `204`

### `PATCH /api/v1/courses/{course_uuid}/lessons/{id}/publish/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `course_uuid`, `id`
- Request body: нет
- Responses:
  - `200`

### `PATCH /api/v1/courses/{course_uuid}/lessons/{id}/restore/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `course_uuid`, `id`
- Request body: нет
- Responses:
  - `200`

### `GET /api/v1/courses/{course_uuid}/lessons/trash/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `course_uuid`
  - `query`: `limit`, `offset`
- Request body: нет
- Responses:
  - `200`: `PaginatedLessonList`

### `POST /api/v1/lessons/{lesson_id}/complete/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `lesson_id`
- Request body: нет
- Responses:
  - `200`

---

## 9) Tests

### `GET /api/v1/lessons/{lesson_id}/tests/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `lesson_id`
  - `query`: `limit`, `offset`
- Request body: нет
- Responses:
  - `200`: `PaginatedTestList`

### `POST /api/v1/lessons/{lesson_id}/tests/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `lesson_id`
- Request body: `Test`
- Responses:
  - `201`: `Test`

### `GET /api/v1/lessons/{lesson_id}/tests/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `lesson_id`, `id`
- Request body: нет
- Responses:
  - `200`: `Test`

### `PATCH /api/v1/lessons/{lesson_id}/tests/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `lesson_id`, `id`
- Request body: `Test`
- Responses:
  - `200`: `Test`

### `DELETE /api/v1/lessons/{lesson_id}/tests/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `lesson_id`, `id`
- Request body: нет
- Responses:
  - `204`

### `POST /api/v1/tests/{test_id}/attempts/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `test_id`
- Request body: `TestAttempt`
- Responses:
  - `201`: `TestAttempt`

### `GET /api/v1/tests/attempts/{attempt_id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `attempt_id`
- Request body: нет
- Responses:
  - `200`: `TestAttempt`

---

## 10) Questions

### `GET /api/v1/tests/{test_id}/questions/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `test_id`
  - `query`: `limit`, `offset`
- Request body: нет
- Responses:
  - `200`: `PaginatedQuestionList`

### `POST /api/v1/tests/{test_id}/questions/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `test_id`
- Request body: `Question`
- Responses:
  - `201`: `Question`

### `GET /api/v1/tests/{test_id}/questions/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `test_id`, `id`
- Request body: нет
- Responses:
  - `200`: `Question`

### `PATCH /api/v1/tests/{test_id}/questions/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `test_id`, `id`
- Request body: `Question`
- Responses:
  - `200`: `Question`

### `DELETE /api/v1/tests/{test_id}/questions/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `test_id`, `id`
- Request body: нет
- Responses:
  - `204`

### `GET /api/v1/attempt/{attempt_id}/questions/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `attempt_id`
  - `query`: `limit`, `offset`
- Request body: нет
- Responses:
  - `200`: `PaginatedQuestionAttemptList`

---

## 11) Options

### `GET /api/v1/questions/{question_id}/options/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `question_id`
  - `query`: `limit`, `offset`
- Request body: нет
- Responses:
  - `200`: `PaginatedOptionAnswerList`

### `POST /api/v1/questions/{question_id}/options/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `question_id`
- Request body: `OptionAnswer`
- Responses:
  - `201`: `OptionAnswer`

### `GET /api/v1/questions/{question_id}/options/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `question_id`, `id`
- Request body: нет
- Responses:
  - `200`: `OptionAnswer`

### `PATCH /api/v1/questions/{question_id}/options/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `question_id`, `id`
- Request body: `OptionAnswer`
- Responses:
  - `200`: `OptionAnswer`

### `DELETE /api/v1/questions/{question_id}/options/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `question_id`, `id`
- Request body: нет
- Responses:
  - `204`

---

## 12) Answers (в рамках attempt/question)

### `GET /api/v1/attempts/{attempt_id}/questions/{question_id}/answers/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `attempt_id`, `question_id`
  - `query`: `limit`, `offset`
- Request body: нет
- Responses:
  - `200`: `PaginatedAnswerList`

### `POST /api/v1/attempts/{attempt_id}/questions/{question_id}/answers/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `attempt_id`, `question_id`
- Request body: `Answer`
- Responses:
  - `201`: `Answer`

### `GET /api/v1/attempts/{attempt_id}/questions/{question_id}/answers/{id}/`

- Auth: `jwtAuth`
- Параметры:
  - `path`: `attempt_id`, `question_id`, `id`
- Request body: нет
- Responses:
  - `200`: `Answer`

---

## 13) Schema endpoint

### `GET /api/v1/schema/`

- Auth: `jwtAuth` или анонимно (`{}`)
- Параметры:
  - `query`: `format` (`json|yaml`)
  - `query`: `lang` (список языков из спецификации)
- Request body: нет
- Responses:
  - `200`: объект схемы OpenAPI (content negotiation)

---

## Примечания по спецификации

- Во множестве ресурсов `PUT` формально присутствует, но документирован как `405 Method Not Allowed`.
- В текущей спецификации определена одна security scheme: `jwtAuth`.
- Где в `security` присутствует `- {}`, endpoint допускает анонимный вызов.

---

## 14) Карта по frontend-экранам (что делает ручка)

Ниже — представление API не по backend-группам, а по пользовательским экранам и сценариям UI.

### Экран: Логин

- `POST /api/v1/auth/token/`
  - Что делает: проверяет `email/password` и возвращает JWT-пару (`access`, `refresh`) для авторизации.
- `POST /api/v1/auth/token/refresh/`
  - Что делает: обновляет `access` по `refresh`, если сессия истекла.
- `GET /api/v1/auth/me/`
  - Что делает: возвращает профиль текущего пользователя после успешного логина/refresh.

### Экран: Профиль пользователя

- `GET /api/v1/auth/me/`
  - Что делает: получает текущие данные пользователя (email, name, phone, role).
- `PATCH /api/v1/auth/me/`
  - Что делает: частично обновляет данные пользователя.
- `PATCH /api/v1/auth/change-password/`
  - Что делает: меняет пароль авторизованного пользователя с проверкой текущего пароля.

### Экран: Восстановление/установка пароля

- `PATCH /api/v1/auth/reset-password/`
  - Что делает: инициирует сброс пароля по email (`verification_email`).
- `GET /api/v1/auth/{registration_uuid}/`
  - Что делает: по ссылке регистрации/установки пароля возвращает данные для формы (в т.ч. email).
- `PATCH /api/v1/auth/{registration_uuid}/`
  - Что делает: устанавливает новый пароль по `registration_uuid` (пароль + повтор).

### Экран: Пространства компаний (список)

- `GET /api/v1/companies/`
  - Что делает: возвращает пагинированный список компаний/пространств (`count/results`) с фильтрами поиска/сортировки.
- `POST /api/v1/companies/`
  - Что делает: создает новую компанию/пространство.

### Экран: Пространство компании (карточка/редактирование)

- `GET /api/v1/companies/{slug}/`
  - Что делает: возвращает подробную информацию о компании.
- `PATCH /api/v1/companies/{slug}/`
  - Что делает: частично обновляет компанию (например, название/описание).
- `DELETE /api/v1/companies/{slug}/`
  - Что делает: удаляет компанию.

### Экран: Подписки пространства

- `GET /api/v1/companies/{company_slug}/subscriptions/`
  - Что делает: возвращает список подписок компании.
- `POST /api/v1/companies/{company_slug}/subscriptions/`
  - Что делает: создает новую подписку для компании.
- `GET /api/v1/companies/{company_slug}/subscriptions/{id}/`
  - Что делает: возвращает детальную запись подписки.
- `PATCH /api/v1/companies/{company_slug}/subscriptions/{id}/`
  - Что делает: частично обновляет подписку.
- `DELETE /api/v1/companies/{company_slug}/subscriptions/{id}/`
  - Что делает: удаляет подписку.

### Экран: Пользователи пространства (сотрудники)

- `GET /api/v1/companies/{company_slug}/employees/`
  - Что делает: возвращает список сотрудников компании с пагинацией/поиском/сортировкой.
- `POST /api/v1/companies/{company_slug}/employees/`
  - Что делает: создает сотрудника в компании.
- `GET /api/v1/companies/{company_slug}/employees/{id}/`
  - Что делает: возвращает карточку конкретного сотрудника.
- `PATCH /api/v1/companies/{company_slug}/employees/{id}/`
  - Что делает: частично обновляет сотрудника.
- `DELETE /api/v1/companies/{company_slug}/employees/{id}/`
  - Что делает: удаляет сотрудника.

### Экран: Финальная регистрация приглашенного сотрудника

- `GET /api/v1/registration/{registration_uuid}/`
  - Что делает: возвращает данные приглашенного пользователя перед финальной регистрацией.
- `PATCH /api/v1/registration/{registration_uuid}/`
  - Что делает: завершает регистрацию приглашенного сотрудника (ввод пароля/профиля).

### Экран: Курсы компании (список/создание)

- `GET /api/v1/companies/{company_slug}/courses/`
  - Что делает: возвращает список курсов компании.
- `POST /api/v1/companies/{company_slug}/courses/`
  - Что делает: создает курс.

### Экран: Карточка курса / редактирование

- `GET /api/v1/companies/{company_slug}/courses/{course_uuid}/`
  - Что делает: возвращает данные курса.
- `PATCH /api/v1/companies/{company_slug}/courses/{course_uuid}/`
  - Что делает: частично обновляет курс.
- `DELETE /api/v1/companies/{company_slug}/courses/{course_uuid}/`
  - Что делает: выполняет мягкое удаление курса (в корзину).
- `PATCH /api/v1/companies/{company_slug}/courses/{course_uuid}/publish/`
  - Что делает: публикует курс (перевод в `PUBLISHED`).
- `PATCH /api/v1/companies/{company_slug}/courses/{course_uuid}/restore/`
  - Что делает: восстанавливает курс из корзины (из `DELETED` в `DRAFT`).
- `DELETE /api/v1/companies/{company_slug}/courses/{course_uuid}/permanent/`
  - Что делает: удаляет курс безвозвратно.
- `GET /api/v1/companies/{company_slug}/courses/{course_uuid}/info/`
  - Что делает: возвращает техническую информацию по удаленному объекту (например `deleted_at`).
- `GET /api/v1/companies/{company_slug}/courses/trash/`
  - Что делает: возвращает список удаленных курсов (корзина).

### Экран: Уроки курса

- `GET /api/v1/courses/{course_uuid}/lessons/`
  - Что делает: возвращает список уроков курса.
- `POST /api/v1/courses/{course_uuid}/lessons/`
  - Что делает: создает урок в курсе.
- `GET /api/v1/courses/{course_uuid}/lessons/{id}/`
  - Что делает: возвращает урок.
- `PATCH /api/v1/courses/{course_uuid}/lessons/{id}/`
  - Что делает: обновляет урок.
- `DELETE /api/v1/courses/{course_uuid}/lessons/{id}/`
  - Что делает: мягко удаляет урок.
- `PATCH /api/v1/courses/{course_uuid}/lessons/{id}/publish/`
  - Что делает: публикует урок.
- `PATCH /api/v1/courses/{course_uuid}/lessons/{id}/restore/`
  - Что делает: восстанавливает урок из корзины.
- `DELETE /api/v1/courses/{course_uuid}/lessons/{id}/permanent/`
  - Что делает: удаляет урок безвозвратно.
- `GET /api/v1/courses/{course_uuid}/lessons/{id}/info/`
  - Что делает: возвращает информацию по удаленному уроку (`deleted_at`).
- `GET /api/v1/courses/{course_uuid}/lessons/trash/`
  - Что делает: возвращает корзину удаленных уроков.
- `POST /api/v1/lessons/{lesson_id}/complete/`
  - Что делает: отмечает урок как завершенный.

### Экран: Тесты урока

- `GET /api/v1/lessons/{lesson_id}/tests/`
  - Что делает: возвращает список тестов урока.
- `POST /api/v1/lessons/{lesson_id}/tests/`
  - Что делает: создает тест в уроке.
- `GET /api/v1/lessons/{lesson_id}/tests/{id}/`
  - Что делает: возвращает тест.
- `PATCH /api/v1/lessons/{lesson_id}/tests/{id}/`
  - Что делает: обновляет тест.
- `DELETE /api/v1/lessons/{lesson_id}/tests/{id}/`
  - Что делает: удаляет тест.

### Экран: Вопросы теста

- `GET /api/v1/tests/{test_id}/questions/`
  - Что делает: возвращает список вопросов теста.
- `POST /api/v1/tests/{test_id}/questions/`
  - Что делает: создает вопрос в тесте.
- `GET /api/v1/tests/{test_id}/questions/{id}/`
  - Что делает: возвращает вопрос.
- `PATCH /api/v1/tests/{test_id}/questions/{id}/`
  - Что делает: обновляет вопрос.
- `DELETE /api/v1/tests/{test_id}/questions/{id}/`
  - Что делает: удаляет вопрос.

### Экран: Варианты ответа вопроса

- `GET /api/v1/questions/{question_id}/options/`
  - Что делает: возвращает список вариантов ответа вопроса.
- `POST /api/v1/questions/{question_id}/options/`
  - Что делает: создает вариант ответа.
- `GET /api/v1/questions/{question_id}/options/{id}/`
  - Что делает: возвращает конкретный вариант ответа.
- `PATCH /api/v1/questions/{question_id}/options/{id}/`
  - Что делает: обновляет вариант ответа.
- `DELETE /api/v1/questions/{question_id}/options/{id}/`
  - Что делает: удаляет вариант ответа.

### Экран: Прохождение теста (attempt flow)

- `POST /api/v1/tests/{test_id}/attempts/`
  - Что делает: создает новую попытку прохождения теста.
- `GET /api/v1/tests/attempts/{attempt_id}/`
  - Что делает: возвращает данные конкретной попытки.
- `GET /api/v1/attempt/{attempt_id}/questions/`
  - Что делает: возвращает вопросы для текущей попытки.
- `GET /api/v1/attempts/{attempt_id}/questions/{question_id}/answers/`
  - Что делает: возвращает ответы по вопросу в рамках попытки.
- `POST /api/v1/attempts/{attempt_id}/questions/{question_id}/answers/`
  - Что делает: создает/отправляет ответ на вопрос в попытке.
- `GET /api/v1/attempts/{attempt_id}/questions/{question_id}/answers/{id}/`
  - Что делает: возвращает конкретный ответ.

### Экран: Кандидаты курса / отклики

- `GET /api/v1/courses/{course_uuid}/applications/`
  - Что делает: возвращает список откликов кандидатов по курсу.
- `GET /api/v1/courses/{course_uuid}/applications/{id}/`
  - Что делает: возвращает детальную карточку отклика кандидата.
- `PATCH /api/v1/courses/{course_uuid}/applications/{id}/`
  - Что делает: обновляет отклик (например, статус/комментарий).
- `POST /api/v1/courses/{course_uuid}/candidate-enrollment/`
  - Что делает: вручную записывает кандидата на курс по email и возвращает статус/ссылку.
- `GET /api/v1/courses/{course_uuid}/candidates/{candidate_id}/answers/`
  - Что делает: возвращает ответы кандидата по урокам курса.

### Экран: Регистрация кандидата

- `POST /api/v1/candidate-registration/`
  - Что делает: регистрирует кандидата (`email`, `password`, `name`, `phone`, `consent_to_data_processing`).
  - Примечание: в OpenAPI у ручки стоит `jwtAuth`.
