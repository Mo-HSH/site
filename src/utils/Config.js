export function getApiUrl(postUrl) {
    return `http://${window.location.hostname}:5050/${postUrl}`;
}
