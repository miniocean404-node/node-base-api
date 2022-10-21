证书对象具有与证书字段对应的属性。

* raw <Buffer> DER 编码的 X.509 证书数据。
* subject <Object> 证书主题，按照国家 (C:)、州或省 (ST)、地区 (L)、组织 (O)、组织单位 (OU) 和通用名称 (CN) 进行描述。 CommonName 通常是带有 TLS 证书的 DNS 名称。 示例：{C: 'UK', ST: 'BC', L: 'Metro', O: 'Node Fans', OU: 'Docs', CN: 'example.com'}。
* issuer <Object> 证书颁发者，使用与 subject 相同的术语描述。
* valid_from <string> 证书有效的开始日期时间。
* valid_to <string> 证书有效的结束日期时间。
* serialNumber <string> 证书序列号，以十六进制字符串表示。 示例：'B9B0D332A1AA5635'。
* fingerprint <string> DER 编码证书的 SHA-1 摘要。 它作为 : 分隔的十六进制字符串返回。 示例：'2A:7A:C2:DD:...'。
* fingerprint256 <string> DER 编码证书的 SHA-256 摘要。 它作为 : 分隔的十六进制字符串返回。 示例：'2A:7A:C2:DD:...'。
* ext_key_usage <Array> （可选的）扩展的密钥用法，一组 OID。
* subjectaltname <string> （可选的）包含主题的连接名称的字符串，subject 名称的替代。
* infoAccess <Array> （可选的）描述 AuthorityInfoAccess 的数组，与OCSP 一起使用。
* issuerCertificate <Object> （可选的）颁发者证书对象。 对于自签名证书，这可能是一个循环引用。
证书可能包含有关公钥的信息，具体取决于密钥类型。

对于 RSA 密钥，可以定义以下属性：

* bits <number> RSA 位大小。 示例：1024。
* exponent <string> RSA 指数，作为十六进制数字表示法的字符串。 示例：'0x010001'。
* modulus <string> RSA 模数，作为十六进制字符串。 示例：'B56CE45CB7...'。
* pubkey <Buffer> 公钥。
对于 EC 密钥，可以定义以下属性：

pubkey <Buffer> 公钥。

* bits <number> 密钥大小（以位为单位）。 示例：256。
* asn1Curve <string> （可选的）椭圆曲线的 OID 的 ASN.1 名称。 知名曲线由 OID 标识。 虽然这很不寻常，但曲线可能是由其数学属性标识的，在这种情况下，它不会有 OID。 示例：'prime256v1'。
* nistCurve <string> （可选的）椭圆曲线的 NIST 名称，如果有的话（并非所有知名曲线都由 NIST 指定名称）。 示例：'P-256'。
```text
{ subject:
   { OU: [ 'Domain Control Validated', 'PositiveSSL Wildcard' ],
     CN: '*.nodejs.org' },
  issuer:
   { C: 'GB',
     ST: 'Greater Manchester',
     L: 'Salford',
     O: 'COMODO CA Limited',
     CN: 'COMODO RSA Domain Validation Secure Server CA' },
  subjectaltname: 'DNS:*.nodejs.org, DNS:nodejs.org',
  infoAccess:
   { 'CA Issuers - URI':
      [ 'http://crt.comodoca.com/COMODORSADomainValidationSecureServerCA.crt' ],
     'OCSP - URI': [ 'http://ocsp.comodoca.com' ] },
  modulus: 'B56CE45CB740B09A13F64AC543B712FF9EE8E4C284B542A1708A27E82A8D151CA178153E12E6DDA15BF70FFD96CB8A88618641BDFCCA03527E665B70D779C8A349A6F88FD4EF6557180BD4C98192872BCFE3AF56E863C09DDD8BC1EC58DF9D94F914F0369102B2870BECFA1348A0838C9C49BD1C20124B442477572347047506B1FCD658A80D0C44BCC16BC5C5496CFE6E4A8428EF654CD3D8972BF6E5BFAD59C93006830B5EB1056BBB38B53D1464FA6E02BFDF2FF66CD949486F0775EC43034EC2602AEFBF1703AD221DAA2A88353C3B6A688EFE8387811F645CEED7B3FE46E1F8B9F59FAD028F349B9BC14211D5830994D055EEA3D547911E07A0ADDEB8A82B9188E58720D95CD478EEC9AF1F17BE8141BE80906F1A339445A7EB5B285F68039B0F294598A7D1C0005FC22B5271B0752F58CCDEF8C8FD856FB7AE21C80B8A2CE983AE94046E53EDE4CB89F42502D31B5360771C01C80155918637490550E3F555E2EE75CC8C636DDE3633CFEDD62E91BF0F7688273694EEEBA20C2FC9F14A2A435517BC1D7373922463409AB603295CEB0BB53787A334C9CA3CA8B30005C5A62FC0715083462E00719A8FA3ED0A9828C3871360A73F8B04A4FC1E71302844E9BB9940B77E745C9D91F226D71AFCAD4B113AAF68D92B24DDB4A2136B55A1CD1ADF39605B63CB639038ED0F4C987689866743A68769CC55847E4A06D6E2E3F1',
  exponent: '0x10001',
  pubkey: <Buffer ... >,
  valid_from: 'Aug 14 00:00:00 2017 GMT',
  valid_to: 'Nov 20 23:59:59 2019 GMT',
  fingerprint: '01:02:59:D9:C3:D2:0D:08:F7:82:4E:44:A4:B4:53:C5:E2:3A:87:4D',
  fingerprint256: '69:AE:1A:6A:D4:3D:C6:C1:1B:EA:C6:23:DE:BA:2A:14:62:62:93:5C:7A:EA:06:41:9B:0B:BC:87:CE:48:4E:02',
  ext_key_usage: [ '1.3.6.1.5.5.7.3.1', '1.3.6.1.5.5.7.3.2' ],
  serialNumber: '66593D57F20CBC573E433381B5FEC280',
  raw: <Buffer ... > }
```
