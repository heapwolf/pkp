# Public Key Pen 
Helps you create and distribute certificates. It is designed
to work in concert with [PKS][0].

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
keys found in a specified package-name or remote.

```
pkp verify <package-name> [version]
```

## FAQ
### INTRODUCTION
_What is this?_

`PKP` is based on the work of [SDSI][1], a simple distributed security
infrastructure. PKP is meant to lower the technical barrier to using
public key cryptography effectively to sign data/software and provide a
means for verifying its origins.

_Is `PKP`/`PKS` if a person is who they say they are?_

No! It's meant for mapping data and software back to people.

### SYBIL ATTACKS
_What about an attack where someone creates a large number of 
pseudonymous certificates, using them to gain a disproportionately large 
influence?_

A Sybil attack depends on how easily certificates can be created. PKS 
is an "invitation-only" model, meaning the only
members have been directly invited to participate. This is highly 
influenced by PGP's "Chaining" style of trust.

### AVAILABILITY/"SCALE"
_"Invitation Only" sounds more secure, but since the networks will be 
more exclusive, it's likely that the information I'm looking for isn't 
available._

Consider a phone book for Earth, you'll never lookup more than n% 
of it. So instead of owning/updating the whole thing, you keep the
parts that are meaningful to you. If there is a number that you need, 
you can add it by becoming the issuer, you are accountable for it.

### LOOKUPS
_How can I determine who created the data/software I care about?_

### DUPLICATION/UNIQUENESS
_What if Bob and John both add Alice to their "little phone books"?_

First entry wins. It should never be removed, the first known public 
key becomes the unique identity for an individual, even if its revoked or 
expired.

### REVOCATION/EXPIRATION
_How is the [CRL latency problem][99] handled?_

Requests to revoke certificates are circulated immediately and a 
certificate gets a "revoked" attribute. If a certificate expires, it gets 
an "expired" attribute.

A certificate should list more than one certificate server in the case
that one is lost. A revocation request should be made.

### MISC
_Is this an [SDSI][98] implementation?_

No. It's research. I'm putting together some practical ideas and 
trying to see where it goes.

[98]:http://people.csail.mit.edu/rivest/sdsi11.html#secprincipals
[99]:http://lcs3.syr.edu/faculty/chin/cse774/readings/pki/gutmann02.pdf

## DATA SPEC (WIP)

### NAME CERTIFICATE
```json
{
  "address-at": "paolo@async.ly",
  "real-name": "Paolo Fragomeni",
  "servers-at": "async.ly ghub.io",
  "expired-at": 1378322707487,
  "revoked-at": 1378322707488,
  "public": "-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAwIB6PV4gYy1X47zQllmke+KGYdXFH1xyrO0q4DZw3OBHr187xZWn81LWI6av\nyIhW+XDeVYuAud1+VqnsvsBASD19qc2xXiZ21cHdSfB1N2nSHBBHB2e+ubhDEN9PbhAcO+BK\ngr8E0/ucGy5thM70KZpVuJGXZJWABzlrin/Q3xyk/46OFQNj5DXjmSfSoWcs76TknAkttz0N\nc4QK3buByERNeWOjJsZjTj5w8StVpwfc2Ut3wUIoks/8w+nwqiAW1tHVoCjcol8fHIvRiiNH\n1bYS+ZkBgb0RUKzQkl+l8o6IfFzhSnvt9g+E5aVOgzJs/O2RdwjpHpVsfwh74pM8qwIDAQAB\n-----END RSA PUBLIC KEY-----\n\n"
}
```

### DATA CERTIFICATE
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
        "address-at": "john@doe.com",
        "real-name": "John Doe",
        "servers-at": ["johndoe.com", "async.ly"],
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
