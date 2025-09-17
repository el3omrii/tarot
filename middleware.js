// middleware.js (for Edge Functions)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)',
  ],
};

// Token verification middleware
export default async function middleware(request) {
  const url = new URL(request.url);
  const apiUrl = "https://oracleapi.rhiyourhi-lila.com/api/tokens/validate";
  const redirectUrl = "https://rhiyourhi-lila.com";
  

  // Check if we have a valid token in query parameters or cookies
  const token = url.searchParams.get('token') || getCookie(request, 'auth-token');
    console.log(token);
  // If no token found, redirect to error page
  if (!token) {
    return redirectResponse(redirectUrl);
  }

  try {
    // Call your API to validate the token
    apiUrl.searchParams.set('token', token);
    
    const response = await fetch(apiUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Token is valid - proceed with request and set cookie for future requests
      const headers = new Headers();
      setCookie(headers, 'auth-token', token, { 
        maxAge: 60 * 60 * 24 // 1 day
      });
      
      return new Response(null, {
        status: 200,
        headers
      });
    } else {
      // Token is invalid
      return redirectResponse(redirectUrl);
    }
  } catch (error) {
    // API call failed
    console.error('Token verification error:', error);
    return redirectResponse(redirectUrl);
  }
}

// Helper function to create a redirect response
function redirectResponse(path) {
  const headers = new Headers();
  headers.set('Location', path);
  return new Response(null, {
    status: 307,
    headers
  });
}

// Helper function to get cookie value from request
function getCookie(request, name) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

// Helper function to set cookie in response headers
function setCookie(headers, name, value, options = {}) {
  const cookieParts = [
    `${name}=${encodeURIComponent(value)}`,
    options.path && `Path=${options.path}`,
    options.maxAge && `Max-Age=${options.maxAge}`,
    options.domain && `Domain=${options.domain}`,
    options.secure && 'Secure',
    options.httpOnly && 'HttpOnly',
    options.sameSite && `SameSite=${options.sameSite}`
  ].filter(Boolean);
  
  headers.append('Set-Cookie', cookieParts.join('; '));
}