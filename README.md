# Public Key Pen 

## SYNOPSIS
PKP helps you create, sign with and distribute public keys. It is designed
to work in concert with [PKS][0].

## MOTIVATION
PKP is based on the work of [SDSI][1], a simple distributed security
infrastructure. PKP is meant to lower the technical barrier to using
public key cryptography effectively to sign data and to some degree
verify its origins.

```
npm install pkp -g
pkp config
```

## SIGNING

### If a `data certificate` does not exist in the repository, recursively 
hash the contents of a remote and produce a `data certificate`. If a `data
certificate` is found, hash the contents of the remote, compare it with the 
hash found in the `data certificate` as well as attempt to validate the
corresponding public keys.
```
pkp sign <package-name> [version]
```
or
```
pkp sign --remote git://github.com/hij1nx/pkp.git
```

## THIRD PARTY VERIFICATION
The verify method tries to validate the certificates and their public 
keys found in a specified pacakge-name or remote.

```
pkp verify <package-name> [version]
```

## NAME CERTIFICATE

```json
{
  "address-at": "paolo@async.ly",
  "real-name": "Paolo Fragomeni",
  "servers-at": "async.ly ghub.io",
  "public": "-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAwIB6PV4gYy1X47zQllmke+KGYdXFH1xyrO0q4DZw3OBHr187xZWn81LWI6av\nyIhW+XDeVYuAud1+VqnsvsBASD19qc2xXiZ21cHdSfB1N2nSHBBHB2e+ubhDEN9PbhAcO+BK\ngr8E0/ucGy5thM70KZpVuJGXZJWABzlrin/Q3xyk/46OFQNj5DXjmSfSoWcs76TknAkttz0N\nc4QK3buByERNeWOjJsZjTj5w8StVpwfc2Ut3wUIoks/8w+nwqiAW1tHVoCjcol8fHIvRiiNH\n1bYS+ZkBgb0RUKzQkl+l8o6IfFzhSnvt9g+E5aVOgzJs/O2RdwjpHpVsfwh74pM8qwIDAQAB\n-----END RSA PUBLIC KEY-----\n\n"
}
```

## DATA CERTIFICATE
semver bla bla bla

```json
{
  "0.0.1": {
    "address-at": "paolo@async.ly",
    "real-name": "Paolo Fragomeni",
    "servers-at": "async.ly",
    "public": "-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAwIB6PV4gYy1X47zQllmke+KGYdXFH1xyrO0q4DZw3OBHr187xZWn81LWI6av\nyIhW+XDeVYuAud1+VqnsvsBASD19qc2xXiZ21cHdSfB1N2nSHBBHB2e+ubhDEN9PbhAcO+BK\ngr8E0/ucGy5thM70KZpVuJGXZJWABzlrin/Q3xyk/46OFQNj5DXjmSfSoWcs76TknAkttz0N\nc4QK3buByERNeWOjJsZjTj5w8StVpwfc2Ut3wUIoks/8w+nwqiAW1tHVoCjcol8fHIvRiiNH\n1bYS+ZkBgb0RUKzQkl+l8o6IfFzhSnvt9g+E5aVOgzJs/O2RdwjpHpVsfwh74pM8qwIDAQAB\n-----END RSA PUBLIC KEY-----\n\n",
    "data": "7330651368657d5f711b5f15481949a9a30221b2",
    "algorithm": "sha1",
    "signatures": [
      {
        "address-at": "holly@hollygolightly.com",
        "real-name": "Holly Golightly",
        "servers-at": "ghub.io",
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

[0]:http://
[1]:http://groups.csail.mit.edu/cis/sdsi.html
[2]:http://www.rsa.com/rsalabs/node.asp?id=2165
[3]:http://firstmonday.org/ojs/index.php/fm/article/view/778/687
