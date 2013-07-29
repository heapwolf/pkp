# Public Key Infrastructure for Packages

## SYNOPSIS
This is a specification and implementation that leverages Public Key 
Infrastructure to build  trust networks for distributed software.

```
npm install pkp -g
```

## SIGNING WORKFLOW

### Step A
`USER A` creates a signing request for the version specified in the
`package.json` file. This results in a `pki.json` file that contains 
`USER A`'s public key and a hash of the codebase (excluding the signing 
file). `pkp` will try to produce a link to where the `pki.json` file is
located (`raw.github.com/user/repo/master/pki.json`, for instance).

```
pkp request --create
```

### Step B
`USER B` passes the link to `pkp` to sign the request. `pkp` outputs
the new signed request. Optionally, it can email the signed request
back to `USER A`.

```
pkp request --sign http://git.io/bOeLyA
```

### Step C
`USER A` can then accept the signed request by merging it back into
their `pki.json`. Optionally republish the package with `+S.<n>` in 
the new version where `n` is the new signed version number.

## THIRD PARTY VERIFICATION
The verify method iterates though the signatures and validates that
they were infact signed using the private key that corresponds to the
public key provided.

```
pkp request --verify [version]
```

## PKI FILE SPECIFICATION
A package should contain a pki.json file which includes an object literal
with entries corresponding to each signed version of the package. The file 
should include the following fields.

### `author`
Extracted from the `package.json`. This is used to alter the user making
the request that a signing has been successful.

### `key`
The public key of the user making the request.

### `sha1`
A sha1 hash of the codebase to be signed.

### `signatures`
An array of object literals representing successful signings that can
be verified using `pkp`.

```json
{
  "0.0.1": {
    "author": "Paolo Fragomeni <paolo@async.ly> http://twitter.com/hij1nx",
    "key": "-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAhz2gGatYvGuUTwxwWeRbexRckpqwV+4EGLqCvlyI62gbVc4iTbAm47pMRdTn\nqFX9TxoVPE3P/p5Md9xH55YVBO/WgIXdpjT3gOmLr3wUsdjn5Hx8ytM/EAOV/WenOmrBB/oP\nW+yg2lbRfkMlTlc59wO9ISp0fCLIX88iixiQrLMhsAzrV0xwRMOsqQCcIPhZESuX1qJ49eSg\nXY7n5BRtADOoFeaLPNeLu5rUHJbeA4Goj85yFxwLrmKJu0CHH+J5ONAnSDTznYeXLGLuiYty\nyh4jO7xwOjyGO68nzo2/F/KYOfyChlY0mPJMpMo91qaQt3aCm6qxcRFcujyjAT68aQIDAQAB\n-----END RSA PUBLIC KEY-----\n\n",
    "sha1": "31d403bcf83a29266595fe31e7170c617eb281a3",
    "signatures": [
      {
        "signature": "CAQEAhz2gGatYvGuUTwxwWeRbexRckpqwV+4EGLqCv",
        "author": "Some User <user@address.com> http://twitter.com/someuser",
        "key": "-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAhz2gGatYvGuUTwxwWeRbexRckpqwV+4EGLqCvlyI62gbVc4iTbAm47pMRdTn\nqFX9TxoVPE3P/p5Md9xH55YVBO/WgIXdpjT3gOmLr3wUsdjn5Hx8ytM/EAOV/WenOmrBB/oP\nW+yg2lbRfkMlTlc59wO9ISp0fCLIX88iixiQrLMhsAzrV0xwRMOsqQCcIPhZESuX1qJ49eSg\nXY7n5BRtADOoFeaLPNeLu5rUHJbeA4Goj85yFxwLrmKJu0CHH+J5ONAnSDTznYeXLGLuiYty\nyh4jO7xwOjyGO68nzo2/F/KYOfyChlY0mPJMpMo91qaQt3aCm6qxcRFcujyjAT68aQIDAQAB\n-----END RSA PUBLIC KEY-----\n\n"
      }
    ]
  }
}
```
