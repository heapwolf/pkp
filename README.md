# Public Key Pen 
Helps you create and distribute certificates.

## USAGE
```
npm install pkp -g
pkp config
```

### SIGNING
```
pkp sign <package-name> [version]
```
or
```
pkp sign git://github.com/<user>/<repo>.git
```

The updated certificate can then be pushed to the remote or published
with the package and won't cause side effects when validated.

### THIRD PARTY VERIFICATION
The verify method tries to validate the certificates and their public 
records.

```
pkp verify <package-name> [version]
```

[98]:http://people.csail.mit.edu/rivest/sdsi11.html#secprincipals
[99]:http://lcs3.syr.edu/faculty/chin/cse774/readings/pki/gutmann02.pdf

## DATA SPEC (WIP)

### NAME CERTIFICATE
```json
{
  "address-at": "paolo@async.ly",
  "real-name": "Paolo Fragomeni",
  "records-at": "https://twitter.com/hij1nx/status/375328317412360192",
  "public": "-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAwIB6PV4gYy1X47zQllmke+KGYdXFH1xyrO0q4DZw3OBHr187xZWn81LWI6av\nyIhW+XDeVYuAud1+VqnsvsBASD19qc2xXiZ21cHdSfB1N2nSHBBHB2e+ubhDEN9PbhAcO+BK\ngr8E0/ucGy5thM70KZpVuJGXZJWABzlrin/Q3xyk/46OFQNj5DXjmSfSoWcs76TknAkttz0N\nc4QK3buByERNeWOjJsZjTj5w8StVpwfc2Ut3wUIoks/8w+nwqiAW1tHVoCjcol8fHIvRiiNH\n1bYS+ZkBgb0RUKzQkl+l8o6IfFzhSnvt9g+E5aVOgzJs/O2RdwjpHpVsfwh74pM8qwIDAQAB\n-----END RSA PUBLIC KEY-----\n\n"
}
```

### DATA CERTIFICATE
```json
{
  "0.0.1": {
    "address-at": "paolo@async.ly",
    "real-name": "Paolo Fragomeni",
    "records-at": "async.ly/y",
    "public": "-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAwIB6PV4gYy1X47zQllmke+KGYdXFH1xyrO0q4DZw3OBHr187xZWn81LWI6av\nyIhW+XDeVYuAud1+VqnsvsBASD19qc2xXiZ21cHdSfB1N2nSHBBHB2e+ubhDEN9PbhAcO+BK\ngr8E0/ucGy5thM70KZpVuJGXZJWABzlrin/Q3xyk/46OFQNj5DXjmSfSoWcs76TknAkttz0N\nc4QK3buByERNeWOjJsZjTj5w8StVpwfc2Ut3wUIoks/8w+nwqiAW1tHVoCjcol8fHIvRiiNH\n1bYS+ZkBgb0RUKzQkl+l8o6IfFzhSnvt9g+E5aVOgzJs/O2RdwjpHpVsfwh74pM8qwIDAQAB\n-----END RSA PUBLIC KEY-----\n\n",
    "data": "7330651368657d5f711b5f15481949a9a30221b2",
    "algorithm": "sha1",
    "signatures": [
      {
        "address-at": "john@doe.com",
        "real-name": "John Doe",
        "records-at": ["johndoe.com/x", "async.ly/y"],
        "public": "-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAwIB6PV4gYy1X47zQllmke+KGYdXFH1xyrO0q4DZw3OBHr187xZWn81LWI6av\nyIhW+XDeVYuAud1+VqnsvsBASD19qc2xXiZ21cHdSfB1N2nSHBBHB2e+ubhDEN9PbhAcO+BK\ngr8E0/ucGy5thM70KZpVuJGXZJWABzlrin/Q3xyk/46OFQNj5DXjmSfSoWcs76TknAkttz0N\nc4QK3buByERNeWOjJsZjTj5w8StVpwfc2Ut3wUIoks/8w+nwqiAW1tHVoCjcol8fHIvRiiNH\n1bYS+ZkBgb0RUKzQkl+l8o6IfFzhSnvt9g+E5aVOgzJs/O2RdwjpHpVsfwh74pM8qwIDAQAB\n-----END RSA PUBLIC KEY-----\n\n",
        "signature": {
          "data": "RjCojNv/oJMarme4zojP43rUKCoLADt2TQxOF2oOpEuOoSjD3uIGXa8raltUf7UNseTPXUFbktspgOaJ/z45C+uhOgdOrhAOgJudCT+22xsW1IG2LFmbnnEv865R5h6w38DYaFZK3BjddLR5IPrkoDHw+Pk5xr43npc/XU1BHxI7/xmNyi3ydm9DJ44WXwiQo7ypK5PbgNC+k6AN+XSFQm+sK1rH7w1d22J+jR48SHejNaXPyAkMEQDuEGu0v/gnT8GSh+GGPqJZNKg8QVbIXK5hDD7ztvHmU3w5hDlzWvUGMJ9OWUlNPrnc/swTW0PdO6C9OinXw7BjXVoJsjQk3g==",
          "algorithm": "sha1-base64"
        }
      }
    ]
  }
}
```

[1]:http://groups.csail.mit.edu/cis/sdsi.html
[2]:http://www.rsa.com/rsalabs/node.asp?id=2165
[3]:http://firstmonday.org/ojs/index.php/fm/article/view/778/687
