# Usage
```bash
$ ./GenerateCsr.sh KEY_FILE_NAME [KEYPASS]
```
## Parameters
Before running the script, edit the fields containing CSR properties inside first (COMMON_NAME, ORGANIZATION_UNIT etc).

`KEY_FILE_NAME` Name of RSA private key to be generated.

`KEYPASS` (Optional) If defined, private key generated would be encrypted with KEYPASS

## Output
The script generates an RSA private key and a corresponding CSR to be uploaded to an app in an Apex gateway. The private
key can then be used for L2 authenticated calls.