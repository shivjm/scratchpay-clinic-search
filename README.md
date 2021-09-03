# scratchpay-clinic-search

A RESTful service to search for clinics in the Scratchpay network.

## API

### GET `/search`

### Query Parameters

You must provide at least one of these as query parameters:

| Name | Description | Example |
|------|-------------|---------|
| `name` | String to search for in clinic name (case-insensitive) | `health` |
| `state` | State name or state code (case-insensitive) | `Alaska`, `KS` |
| `from` & `to` | Time window (times between `00:00` and `24:00`) | `05:00` & `12:32`, `21:13` & `24:00` |

When `from` and `to` are specified, they will be interpreted as a time
window that must overlap with the hours of the clinic. For example,
setting `from` to `07:00` and `to` to `09:00` will match a clinic
whose hours are 08:00 to 15:00, as the clinic is open during some part
of the window.

**Note:** It is an error to specify only one of `from` and `to`.

### Response

A JSON array of clinics matching the specified criteria. For example:

```json
[
    {
        "name": "Scratchpay Test Pet Medical Center",
        "state": {
            "code": "CA",
            "name": "California"
        },
        "availability": {
            "from": "00:00",
            "to": "24:00"
        }
    },
    {
        "name": "German Pets Clinics",
        "state": {
            "code": "KS",
            "name": "Kansas"
        },
        "availability": {
            "from": "08:00",
            "to": "20:00"
        }
    }
]
```

### Example

If the server is running locally on port 3000, you can search for all
clinics in Florida open sometime between 4:00 AM and 9:30 AM with
`pet` in their names using curl like this:

<kbd>curl localhost:3000/search?from=04%3A00&to=09%3A30&name=pet&state=Florida</kbd>

## Building

With [Node 14 or above](https://nodejs.org/):

1. Run <kbd>npm install</kbd>.
2. Run <kbd>npm build</kbd>.

## Running

For development: <kbd>npm run dev</kbd>.

For production (after <kbd>npm build</kbd>): <kbd>node start
dist/src/index.js</kbd>.

### Configuration

You must provide these settings through environment variables or in a .env file:

| Name | Description | Example |
|------|-------------|---------|
| `API_URL` | The base URL for the Scratchpay API, with a trailing slash | `https://www.example.com/api/` |
| `CLINIC_FILES` | A comma-separated list of types of clinics | `vet,dental` (corresponds to `vet-clinics.json` and `dental-clinics.json`) |
| `DATA_CACHE_DURATION` | How long in seconds to cache the remote data for (0 to always fetch & parse new data on every request) | 3600 |
| `PORT` | The port to listen for requests on | 3000 |
| `TIMEOUT` | How long in seconds to try to fetch remote data before timing out | 60 |

### Docker

A ready-made Docker image is available at [ghcr.io/shivjm/scratchpay-clinic-search](https://github.com/shivjm/scratchpay-clinic-search/pkgs/container/scratchpay-clinic-search). You can run it from the command-line using a pre-existing .env file like this: <kbd>docker run -it --env-file=.env ghcr.io/shivjm/scratchpay-clinic-search:latest</kbd>. Alternatively, you can specify each environment variable using the <kbd>-e</kbd> flag, e.g. <kbd>docker run -it -e API_URL=https://www.example.com/ ghcr.io/shivjm/scratchpay-clinic-search:latest</kbd>.
