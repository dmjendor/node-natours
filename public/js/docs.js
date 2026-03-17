/* eslint-env browser */

(function () {
  const apiBase = `${window.location.origin}/api/v1`;

  const groups = [
    {
      name: 'Tours',
      endpoints: [
        {
          id: 'tours-list',
          method: 'GET',
          path: '/tours',
          title: 'Get All Tours',
          auth: 'Public',
          description:
            'Returns all visible tours. Supports filtering, sorting, field limiting, and pagination through query params.',
          params: [
            'Query: limit, sort, fields, page',
            'Query filters such as difficulty=easy or price[lte]=1000',
          ],
          sampleBody: null,
          responses: ['200 success', 'results count', 'data.doc array'],
        },
        {
          id: 'tours-one',
          method: 'GET',
          path: '/tours/:id',
          title: 'Get One Tour',
          auth: 'Public',
          description:
            'Loads a single tour by MongoDB ObjectId and populates its reviews.',
          params: ['Path: id'],
          sampleBody: null,
          responses: ['200 success', 'data.doc object'],
        },
        {
          id: 'tours-create',
          method: 'POST',
          path: '/tours',
          title: 'Create Tour',
          auth: 'JWT (lead-guide, admin)',
          description: 'Creates a new tour document.',
          params: ['Header: Authorization Bearer <jwt>'],
          sampleBody: {
            name: 'The Forest Hiker Plus',
            duration: 5,
            maxGroupSize: 12,
            difficulty: 'easy',
            price: 597,
            summary: 'A relaxed hike through forest trails.',
            secretTour: false,
          },
          responses: ['201 success', 'data.doc object'],
        },
        {
          id: 'tours-update',
          method: 'PATCH',
          path: '/tours/:id',
          title: 'Update Tour',
          auth: 'JWT (admin, lead-guide)',
          description: 'Updates an existing tour with validation enabled.',
          params: ['Path: id', 'Header: Authorization Bearer <jwt>'],
          sampleBody: { price: 649, summary: 'Updated summary text.' },
          responses: ['201 success', 'data.data object'],
        },
        {
          id: 'tours-delete',
          method: 'DELETE',
          path: '/tours/:id',
          title: 'Delete Tour',
          auth: 'JWT (admin, lead-guide)',
          description: 'Deletes a tour by id.',
          params: ['Path: id', 'Header: Authorization Bearer <jwt>'],
          sampleBody: null,
          responses: ['204 success'],
        },
        {
          id: 'tours-top',
          method: 'GET',
          path: '/tours/top-5-cheap',
          title: 'Top 5 Cheap Tours',
          auth: 'Public',
          description:
            'Alias route that preloads limit, sorting, and selected fields.',
          params: [],
          sampleBody: null,
          responses: ['200 success', 'data.doc array'],
        },
        {
          id: 'tours-stats',
          method: 'GET',
          path: '/tours/tour-stats',
          title: 'Tour Stats',
          auth: 'Public',
          description:
            'Aggregation endpoint for tour rating and price metrics.',
          params: [],
          sampleBody: null,
          responses: ['201 success', 'data array'],
        },
        {
          id: 'tours-monthly',
          method: 'GET',
          path: '/tours/monthly-plan/:year',
          title: 'Monthly Plan',
          auth: 'JWT (admin, lead-guide, guide)',
          description:
            'Returns aggregated monthly tour starts for a given year.',
          params: ['Path: year', 'Header: Authorization Bearer <jwt>'],
          sampleBody: null,
          responses: ['201 success', 'data array'],
        },
        {
          id: 'tours-within',
          method: 'GET',
          path: '/tours/tours-within/:distance/center/:latlng/unit/:unit',
          title: 'Tours Within Radius',
          auth: 'Public',
          description: 'Geo query for tours within a distance from a point.',
          params: ['Path: distance', 'Path: latlng', 'Path: unit (mi|km)'],
          sampleBody: null,
          responses: ['201 success', 'results count', 'data.data array'],
        },
        {
          id: 'tours-distances',
          method: 'GET',
          path: '/tours/distances/:latlng/unit/:unit',
          title: 'Distances to Tours',
          auth: 'Public',
          description: 'Returns computed distances from a point to tours.',
          params: ['Path: latlng', 'Path: unit (mi|km)'],
          sampleBody: null,
          responses: ['201 success', 'results count', 'data.data array'],
        },
      ],
    },
    {
      name: 'Users & Auth',
      endpoints: [
        {
          id: 'users-signup',
          method: 'POST',
          path: '/users/signup',
          title: 'Signup',
          auth: 'Public',
          description: 'Creates a user and returns a JWT token.',
          params: [],
          sampleBody: {
            name: 'Lee Vaughan',
            email: 'lee@example.com',
            password: 'password1234',
            passwordConfirm: 'password1234',
          },
          responses: ['201 success', 'token', 'data.user object'],
        },
        {
          id: 'users-login',
          method: 'POST',
          path: '/users/login',
          title: 'Login',
          auth: 'Public',
          description: 'Authenticates a user and returns a JWT token.',
          params: [],
          sampleBody: {
            email: 'lee@example.com',
            password: 'password1234',
          },
          responses: ['200 success', 'token', 'data.user object'],
        },
        {
          id: 'users-forgot',
          method: 'POST',
          path: '/users/forgotPassword',
          title: 'Forgot Password',
          auth: 'Public',
          description:
            'Creates a reset token and attempts to send an email using the configured mail transport.',
          params: [],
          sampleBody: { email: 'lee@example.com' },
          responses: ['200 success message', '404 if user does not exist'],
        },
        {
          id: 'users-reset',
          method: 'PATCH',
          path: '/users/resetPassword/:token',
          title: 'Reset Password',
          auth: 'Public',
          description: 'Sets a new password using a valid reset token.',
          params: ['Path: token'],
          sampleBody: {
            password: 'newpassword1234',
            passwordConfirm: 'newpassword1234',
          },
          responses: ['200 success', 'token', 'data.user object'],
        },
        {
          id: 'users-me',
          method: 'GET',
          path: '/users/me',
          title: 'Current User',
          auth: 'JWT',
          description: 'Returns the authenticated user document.',
          params: ['Header: Authorization Bearer <jwt>'],
          sampleBody: null,
          responses: ['200 success', 'data.doc object'],
        },
        {
          id: 'users-update-password',
          method: 'PATCH',
          path: '/users/updateMyPassword',
          title: 'Update Current Password',
          auth: 'JWT',
          description:
            'Changes the logged-in user password and returns a new JWT.',
          params: ['Header: Authorization Bearer <jwt>'],
          sampleBody: {
            passwordCurrent: 'password1234',
            password: 'newpassword1234',
            passwordConfirm: 'newpassword1234',
          },
          responses: ['200 success', 'token', 'data.user object'],
        },
        {
          id: 'users-update-me',
          method: 'PATCH',
          path: '/users/updateMe',
          title: 'Update Me',
          auth: 'JWT',
          description: 'Updates only name and email for the current user.',
          params: ['Header: Authorization Bearer <jwt>'],
          sampleBody: { name: 'Lee Updated', email: 'lee.updated@example.com' },
          responses: ['200 success', 'data.user object'],
        },
        {
          id: 'users-delete-me',
          method: 'DELETE',
          path: '/users/deleteMe',
          title: 'Deactivate Me',
          auth: 'JWT',
          description: 'Soft-deletes the current user by setting active=false.',
          params: ['Header: Authorization Bearer <jwt>'],
          sampleBody: null,
          responses: ['200 success', 'data null'],
        },
        {
          id: 'users-list',
          method: 'GET',
          path: '/users',
          title: 'Get All Users',
          auth: 'JWT (admin)',
          description: 'Admin-only user listing.',
          params: ['Header: Authorization Bearer <jwt>'],
          sampleBody: null,
          responses: ['200 success', 'data.doc array'],
        },
        {
          id: 'users-one',
          method: 'GET',
          path: '/users/:id',
          title: 'Get One User',
          auth: 'JWT (admin)',
          description: 'Admin-only user lookup by id.',
          params: ['Path: id', 'Header: Authorization Bearer <jwt>'],
          sampleBody: null,
          responses: ['200 success', 'data.doc object'],
        },
        {
          id: 'users-update-admin',
          method: 'PATCH',
          path: '/users/:id',
          title: 'Admin Update User',
          auth: 'JWT (admin)',
          description: 'Admin-only direct user update.',
          params: ['Path: id', 'Header: Authorization Bearer <jwt>'],
          sampleBody: { role: 'guide', name: 'Team Guide' },
          responses: ['201 success', 'data.data object'],
        },
        {
          id: 'users-delete-admin',
          method: 'DELETE',
          path: '/users/:id',
          title: 'Admin Delete User',
          auth: 'JWT (admin)',
          description: 'Admin-only delete by id.',
          params: ['Path: id', 'Header: Authorization Bearer <jwt>'],
          sampleBody: null,
          responses: ['204 success'],
        },
      ],
    },
    {
      name: 'Reviews',
      endpoints: [
        {
          id: 'reviews-list',
          method: 'GET',
          path: '/reviews',
          title: 'Get All Reviews',
          auth: 'JWT',
          description:
            'Returns all reviews. Supports nested usage under tours as well.',
          params: ['Header: Authorization Bearer <jwt>'],
          sampleBody: null,
          responses: ['200 success', 'data.doc array'],
        },
        {
          id: 'reviews-tour-list',
          method: 'GET',
          path: '/tours/:tourId/reviews',
          title: 'Get Reviews For Tour',
          auth: 'JWT',
          description: 'Returns reviews filtered to a specific tour.',
          params: ['Path: tourId', 'Header: Authorization Bearer <jwt>'],
          sampleBody: null,
          responses: ['200 success', 'data.doc array'],
        },
        {
          id: 'reviews-create',
          method: 'POST',
          path: '/tours/:tourId/reviews',
          title: 'Create Review For Tour',
          auth: 'JWT (user)',
          description:
            'Creates a review and automatically injects the current user id and route tour id.',
          params: ['Path: tourId', 'Header: Authorization Bearer <jwt>'],
          sampleBody: { review: 'Excellent guide and scenery.', rating: 4.8 },
          responses: ['201 success', 'data.doc object'],
        },
        {
          id: 'reviews-one',
          method: 'GET',
          path: '/reviews/:id',
          title: 'Get One Review',
          auth: 'JWT',
          description: 'Loads a single review by id.',
          params: ['Path: id', 'Header: Authorization Bearer <jwt>'],
          sampleBody: null,
          responses: ['200 success', 'data.doc object'],
        },
        {
          id: 'reviews-update',
          method: 'PATCH',
          path: '/reviews/:id',
          title: 'Update Review',
          auth: 'JWT (user, admin)',
          description: 'Updates an existing review.',
          params: ['Path: id', 'Header: Authorization Bearer <jwt>'],
          sampleBody: { review: 'Updated review text.', rating: 4.2 },
          responses: ['201 success', 'data.data object'],
        },
        {
          id: 'reviews-delete',
          method: 'DELETE',
          path: '/reviews/:id',
          title: 'Delete Review',
          auth: 'JWT (user, admin)',
          description: 'Deletes a review by id.',
          params: ['Path: id', 'Header: Authorization Bearer <jwt>'],
          sampleBody: null,
          responses: ['204 success'],
        },
      ],
    },
  ];

  const endpointList = document.getElementById('endpoint-list');
  const sidebarNav = document.getElementById('sidebar-nav');
  const searchInput = document.getElementById('endpoint-search');
  const baseUrl = document.getElementById('base-url');
  const quickstartCode = document.getElementById('quickstart-code');

  baseUrl.textContent = apiBase;
  quickstartCode.textContent = [
    `curl ${apiBase}/tours`,
    '',
    `curl -X POST ${apiBase}/users/login \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -d '{"email":"lee@example.com","password":"password1234"}'`,
    '',
    '# Then use the returned token on protected routes',
    `curl ${apiBase}/users/me \\`,
    `  -H "Authorization: Bearer <jwt>"`,
  ].join('\n');

  function methodClass(method) {
    return `method-${method.toLowerCase()}`;
  }

  function buildCurl(endpoint) {
    const lines = [`curl -X ${endpoint.method} ${apiBase}${endpoint.path}`];
    if (endpoint.auth !== 'Public') {
      lines.push('  -H "Authorization: Bearer <jwt>"');
    }
    if (endpoint.sampleBody) {
      lines.push('  -H "Content-Type: application/json"');
      lines.push(`  -d '${JSON.stringify(endpoint.sampleBody, null, 2)}'`);
    }
    return lines.join(' \\\n');
  }

  function renderNav(filteredGroups) {
    sidebarNav.innerHTML = filteredGroups
      .map(
        (group) => `
          <div class="nav-group">
            <h3>${group.name}</h3>
            ${group.endpoints
              .map(
                (endpoint) => `
                  <a href="#${endpoint.id}">${endpoint.method} ${endpoint.title}</a>
                `
              )
              .join('')}
          </div>
        `
      )
      .join('');
  }

  function escapeHtml(value) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }

  function renderEndpoints(filteredGroups) {
    const cards = filteredGroups
      .flatMap((group) => group.endpoints)
      .map(
        (endpoint) => `
          <article id="${endpoint.id}" class="endpoint-card">
            <div class="endpoint-top">
              <div>
                <span class="method-badge ${methodClass(endpoint.method)}">${endpoint.method}</span>
                <span class="auth-badge">${endpoint.auth}</span>
                <h3 class="endpoint-title">${endpoint.title}</h3>
                <code class="endpoint-path">${apiBase}${endpoint.path}</code>
              </div>
            </div>
            <div class="endpoint-grid">
              <div>
                <p>${endpoint.description}</p>
                <div class="field-list">
                  ${
                    endpoint.params.length
                      ? endpoint.params
                          .map(
                            (param) => `
                            <div class="field">
                              <strong>Parameter</strong>
                              <span>${param}</span>
                            </div>
                          `
                          )
                          .join('')
                      : '<div class="field"><strong>Parameters</strong><span>None</span></div>'
                  }
                  ${
                    endpoint.sampleBody
                      ? `
                        <div class="field">
                          <strong>Sample body</strong>
                          <div class="code-panel">
                            <button class="copy-button" data-copy="${encodeURIComponent(
                              JSON.stringify(endpoint.sampleBody, null, 2)
                            )}" type="button">Copy</button>
                            <pre>${escapeHtml(JSON.stringify(endpoint.sampleBody, null, 2))}</pre>
                          </div>
                        </div>
                      `
                      : ''
                  }
                </div>
              </div>
              <div class="response-list">
                <div class="response-item">
                  <strong>Expected response</strong>
                  <span>${endpoint.responses.join(', ')}</span>
                </div>
                <div class="response-item">
                  <strong>Sample curl</strong>
                  <div class="code-panel">
                    <button class="copy-button" data-copy="${encodeURIComponent(
                      buildCurl(endpoint)
                    )}" type="button">Copy</button>
                    <pre>${escapeHtml(buildCurl(endpoint))}</pre>
                  </div>
                </div>
              </div>
            </div>
          </article>
        `
      );

    endpointList.innerHTML = cards.length
      ? cards.join('')
      : '<div class="empty-state">No endpoints match that search.</div>';
  }

  function filterGroups(term) {
    const normalized = term.trim().toLowerCase();
    if (!normalized) return groups;

    return groups
      .map((group) => ({
        ...group,
        endpoints: group.endpoints.filter((endpoint) => {
          const haystack = [
            group.name,
            endpoint.method,
            endpoint.title,
            endpoint.path,
            endpoint.description,
            endpoint.auth,
          ]
            .join(' ')
            .toLowerCase();

          return haystack.includes(normalized);
        }),
      }))
      .filter((group) => group.endpoints.length > 0);
  }

  function render() {
    const filteredGroups = filterGroups(searchInput.value);
    renderNav(filteredGroups);
    renderEndpoints(filteredGroups);
  }

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('.copy-button');
    if (!button) return;

    const targetId = button.getAttribute('data-copy-target');
    const literal = button.getAttribute('data-copy');
    const text = targetId
      ? document.getElementById(targetId).textContent
      : decodeURIComponent(literal);

    try {
      await navigator.clipboard.writeText(text);
      const previousText = button.textContent;
      button.textContent = 'Copied';
      window.setTimeout(() => {
        button.textContent = previousText;
      }, 1200);
    } catch (error) {
      button.textContent = 'Failed';
      window.setTimeout(() => {
        button.textContent = 'Copy';
      }, 1200);
    }
  });

  searchInput.addEventListener('input', render);
  render();
})();
