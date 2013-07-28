# Public Key Infrastructure for Packages

## SYNOPSIS
This is a specification that leverages Public Key Infrastructure to build 
trust networks for distributed software.

## MOTIVATION


## SPECIFICATION
A package should contain a pki.json file that includes the following fields.

### `key`
A public key 

### `signers`
An object literal of "package signers", where the key is the package version
and the value is an array of signers for the specific version.

```json
{
  "0.0.1": {
    "key": "-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAhz2gGatYvGuUTwxwWeRbexRckpqwV+4EGLqCvlyI62gbVc4iTbAm47pMRdTn\nqFX9TxoVPE3P/p5Md9xH55YVBO/WgIXdpjT3gOmLr3wUsdjn5Hx8ytM/EAOV/WenOmrBB/oP\nW+yg2lbRfkMlTlc59wO9ISp0fCLIX88iixiQrLMhsAzrV0xwRMOsqQCcIPhZESuX1qJ49eSg\nXY7n5BRtADOoFeaLPNeLu5rUHJbeA4Goj85yFxwLrmKJu0CHH+J5ONAnSDTznYeXLGLuiYty\nyh4jO7xwOjyGO68nzo2/F/KYOfyChlY0mPJMpMo91qaQt3aCm6qxcRFcujyjAT68aQIDAQAB\n-----END RSA PUBLIC KEY-----\n\n",
    "sha1": "31d403bcf83a29266595fe31e7170c617eb281a3",
    "signatures": [
      {
        "signature": "CAQEAhz2gGatYvGuUTwxwWeRbexRckpqwV+4EGLqCv",
        "name": "julian",
        "key": "-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAhz2gGatYvGuUTwxwWeRbexRckpqwV+4EGLqCvlyI62gbVc4iTbAm47pMRdTn\nqFX9TxoVPE3P/p5Md9xH55YVBO/WgIXdpjT3gOmLr3wUsdjn5Hx8ytM/EAOV/WenOmrBB/oP\nW+yg2lbRfkMlTlc59wO9ISp0fCLIX88iixiQrLMhsAzrV0xwRMOsqQCcIPhZESuX1qJ49eSg\nXY7n5BRtADOoFeaLPNeLu5rUHJbeA4Goj85yFxwLrmKJu0CHH+J5ONAnSDTznYeXLGLuiYty\nyh4jO7xwOjyGO68nzo2/F/KYOfyChlY0mPJMpMo91qaQt3aCm6qxcRFcujyjAT68aQIDAQAB\n-----END RSA PUBLIC KEY-----\n\n"
      }
    ]
  }
}
```

## SIGNING WORKFLOW

- `USER A` creates a signing request with their public key and a hash of the codebase
- `USER A` adds a signer in which `pkp` emails a link alerting `USER B` to the request
- `USER B` passes the link to `pkp` to sign the request in which `pkp` emails `USER A` with the signed request.
- `USER A` can then add the signed request to their `pki.json` file and republish with `+S.n` in the new version where `n` is the next signing.
