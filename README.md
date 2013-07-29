# Public Key Infrastructure for Packages

```
npm install pkp -g
```

## SYNOPSIS
This is a specification and implementation that leverages Public Key 
Infrastructure to build  trust networks for distributed software.


## SIGNING WORKFLOW

### Step A
`USER A` creates a signing request for the version specified in the
`package.json` file. This includes `USER A`'s public key and a hash
of the codebase (excluding the signing file).

```
pkp request
```

### Step B
`USER A` adds "signers" in which `pkp` emails a link alerting each
signer. Let `USER B` be a signer for the request in this case.

```
pkp request signer dominic@dominictarr.com
```

### Step C
`USER B` passes the link to `pkp` to sign the request in which `pkp`
emails `USER A` with the signed request. `pkp` posts the signing data
to a public service of record. The data includes the public key of the
signer and the signiture that was made using the `sha1` as the secret 
to sign with.

```
pkp request sign http://git.io/bOeLyA
```

### Step D
`USER A` can then accept the signed request by using `pkp` to add it to
their `pki.json` file and republish with `+S.n` in the new version where
`n` is the next signing. This includes the signing data from `USER B` 
which can then be used to verify the signature.

```
pkp request accept ...
```

## THIRD PARTY VERIFICATION
When `USER C` whants to verify the package, they use the data that has
been written to `pki.json` by executing the following command.

```
pkp verify
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
        "name": "julian",
        "publicRecord": "http://git.io/b1dqG4",
        "key": "-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAhz2gGatYvGuUTwxwWeRbexRckpqwV+4EGLqCvlyI62gbVc4iTbAm47pMRdTn\nqFX9TxoVPE3P/p5Md9xH55YVBO/WgIXdpjT3gOmLr3wUsdjn5Hx8ytM/EAOV/WenOmrBB/oP\nW+yg2lbRfkMlTlc59wO9ISp0fCLIX88iixiQrLMhsAzrV0xwRMOsqQCcIPhZESuX1qJ49eSg\nXY7n5BRtADOoFeaLPNeLu5rUHJbeA4Goj85yFxwLrmKJu0CHH+J5ONAnSDTznYeXLGLuiYty\nyh4jO7xwOjyGO68nzo2/F/KYOfyChlY0mPJMpMo91qaQt3aCm6qxcRFcujyjAT68aQIDAQAB\n-----END RSA PUBLIC KEY-----\n\n"
      }
    ]
  }
}
```
