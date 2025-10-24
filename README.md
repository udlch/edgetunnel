# edgetunnel
This is a script based on the CF Worker platform, modified from the original version to convert VLESS configuration information into subscription content. Using this script, you can easily convert VLESS configuration information into tools like Clash or Singbox using online configuration.

- Basic Deployment Video Tutorial: https://www.youtube.com/watch?v=LeT4jQUh8ok
- Quick Deployment Video Tutorial: https://www.youtube.com/watch?v=59THrmJhmAw ***Highly Recommended!!!***
- Advanced Usage Video Tutorial: https://www.youtube.com/watch?v=s91zjpw3-P8
- **From Beginner to Expert** Tutorial: https://www.youtube.com/watch?v=oRYnrp5rQSc ***Must Watch! Must Watch! Must Watch!!!***

Telegram Group: [@CMLiussss](https://t.me/CMLiussss), **Thanks to [Alice Networks](https://url.cmliussss.com/alice) for providing cloud servers to maintain the [CM Subscription Conversion Service](https://sub.fxxk.dedyn.io/)!**

# Disclaimer

This disclaimer applies to the "edgetunnel" project (hereinafter referred to as "this project") on GitHub, with the project link: https://github.com/cmliu/edgetunnel.

### Purpose
This project is designed and developed solely for educational, research, and security testing purposes. It aims to provide security researchers, academics, and technology enthusiasts with a tool to explore and practice network communication technologies.

### Legality
When downloading and using the code of this project, users must comply with applicable laws and regulations. Users are responsible for ensuring that their actions comply with the legal framework, rules, regulations, and other relevant provisions in their region.

### Exemption
1. As the **secondary development author** (hereinafter referred to as "author") of this project, I, **cmliu**, emphasize that this project should only be used for legal, ethical, and educational purposes.
2. The author does not endorse, support, or encourage any form of illegal use. If this project is found to be used for any illegal or unethical activities, the author will strongly condemn it.
3. The author is not responsible for any illegal activities carried out by any person or organization using the code of this project. Any consequences arising from the use of this project's code shall be borne by the user.
4. The author is not responsible for any direct or indirect damages that may be caused by using the code of this project.
5. To avoid any unforeseen consequences or legal risks, users should delete the code of this project within 24 hours after using it.

By using the code of this project, the user understands and agrees to all terms of this disclaimer. If the user does not agree to these terms, they should immediately stop using this project.

The author reserves the right to update this disclaimer at any time without prior notice. The latest version of the disclaimer will be published on the GitHub page of this project.

## Risk Warning
- Avoid leaking node configuration information by submitting fake node configurations to the subscription service.
- Alternatively, you can choose to deploy your own [WorkerVless2sub Subscription Generation Service](https://github.com/cmliu/WorkerVless2sub) to leverage the convenience of a subscription generator.

## Workers Deployment Method [Video Tutorial](https://www.youtube.com/watch?v=LeT4jQUh8ok&t=83s)

<details>
<summary><code><strong>「 Workers Deployment Text Tutorial 」</strong></code></summary>

1. Deploy CF Worker:
   - Create a new Worker in the CF Worker console.
   - Paste the content of [worker.js](https://github.com/cmliu/edgetunnel/blob/main/_worker.js) into the Worker editor.
   - Change `userID` on line 7 to your own **UUID**.

2. Access Subscription Content:
   - Visit `https://[YOUR-WORKERS-URL]/[UUID]` to get the subscription content.
   - For example, `https://vless.google.workers.dev/90cd4a77-141a-43c9-991b-08263cfe9c10` is your universal adaptive subscription address.
   - For example, `https://vless.google.workers.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?sub` is the Base64 subscription format, suitable for PassWall, SSR+, etc.
   - For example, `https://vless.google.workers.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?clash` is the Clash subscription format, suitable for OpenClash, etc.
   - For example, `https://vless.google.workers.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?sb` is the Singbox subscription format, suitable for Singbox, etc.

3. Bind a custom domain to workers:
   - In the workers console, go to the `Triggers` tab, then click `Add Custom Domain` below.
   - Fill in your secondary domain that has been transferred to CF domain resolution service, for example: `vless.google.com`, then click `Add Custom Domain` and wait for the certificate to take effect.
   - **If you are a novice, you can take off directly now, no need to read further!!!**

4. Use subscription content with your own `optimized domain`/`optimized IP`:
   - If you want to use your own optimized domain or optimized IP, you can refer to the deployment instructions in the [WorkerVless2sub GitHub repository](https://github.com/cmliu/WorkerVless2sub) to set it up yourself.
   - Open the [worker.js](https://github.com/cmliu/edgetunnel/blob/main/_worker.js) file, find the `sub` variable on line 12, and change it to the address of your deployed subscription generator. For example, `let sub = 'sub.cmliussss.workers.dev';` Note that you should not include protocol information like https or symbols.
   - Note that if you use your own subscription address, the `sub` domain of the subscription generator and the domain of `[YOUR-WORKER-URL]` must not belong to the same top-level domain, otherwise an anomaly will occur. You can assign the workers.dev allocated domain to the `sub` variable.

</details>

## Pages Upload Deployment Method **Highly Recommended!!!** [Video Tutorial](https://www.youtube.com/watch?v=59THrmJhmAw)

<details>
<summary><code><strong>「 Pages Upload File Deployment Text Tutorial 」</strong></code></summary>

1. Deploy CF Pages:
   - Download the [main.zip](https://github.com/cmliu/edgetunnel/archive/refs/heads/main.zip) file, and give it a Star!!!
   - In the CF Pages console, select `Upload assets`, then name your project and click `Create project`. Then upload the [main.zip](https://github.com/cmliu/edgetunnel/archive/refs/heads/main.zip) file you downloaded and click `Deploy site`.
   - After deployment, click `Continue to site`, then select `Settings` > `Environment variables` > **Create** variables for production environment > `Add variable`.
     Fill in **UUID** as the variable name, and your UUID as the value, then click `Save`.
   - Return to the `Deployments` tab, click `Create new deployment` in the lower right corner, then re-upload the [main.zip](https://github.com/cmliu/edgetunnel/archive/refs/heads/main.zip) file and click `Save and deploy`.

2. Access Subscription Content:
   - Visit `https://[YOUR-PAGES-URL]/[YOUR-UUID]` to get the subscription content.
   - For example, `https://edgetunnel.pages.dev/90cd4a77-141a-43c9-991b-08263cfe9c10` is your universal adaptive subscription address.
   - For example, `https://edgetunnel.pages.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?sub` is the Base64 subscription format, suitable for PassWall, SSR+, etc.
   - For example, `https://edgetunnel.pages.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?clash` is the Clash subscription format, suitable for OpenClash, etc.
   - For example, `https://edgetunnel.pages.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?sb` is the Singbox subscription format, suitable for Singbox, etc.

3. Bind CNAME custom domain to Pages: [Video Tutorial](https://www.youtube.com/watch?v=LeT4jQUh8ok&t=851s)
   - In the Pages console, go to the `Custom domains` tab, then click `Set up a custom domain` below.
   - Fill in your custom secondary domain, note that you should not use your root domain. For example:
     If your assigned domain is `fuck.cloudns.biz`, then fill in `lizi.fuck.cloudns.biz` to add a custom domain;
   - According to CF's requirements, return to your domain's DNS provider, add a CNAME record `edgetunnel.pages.dev` for this custom domain `lizi`, then click `Activate domain`.
   - **If you are a novice, then after binding your custom domain to Pages, you can take off directly, no need to read further!!!**

4. Use subscription content with your own `optimized domain`/`optimized IP`:
   - If you want to use your own optimized domain or optimized IP, you can refer to the deployment instructions in the [WorkerVless2sub GitHub repository](https://github.com/cmliu/WorkerVless2sub) to set it up yourself.
   - In the Pages console, go to the `Settings` tab, select `Environment variables` > `Create` > `Edit variables` > `Add variable`;
   - Set the variable name to `SUB`, and the corresponding value to the address of your deployed subscription generator. For example, `sub.cmliussss.workers.dev`, then click **Save**.
   - Then in the Pages console, go to the `Deployments` tab, select `All deployments` > `...` on the far right of the latest deployment > `Retry deployment`.
   - Note that if you use your own subscription address, the `SUB` domain of the subscription generator and the domain of `[YOUR-PAGES-URL]` must not belong to the same top-level domain, otherwise an anomaly will occur. You can assign the Pages.dev allocated domain to the `SUB` variable.

</details>

## Pages GitHub Deployment Method [Video Tutorial](https://www.youtube.com/watch?v=LeT4jQUh8ok&t=560s)

<details>
<summary><code><strong>「 Pages GitHub Deployment Text Tutorial 」</strong></code></summary>

1. Deploy CF Pages:
   - First, Fork this project on Github, and give it a Star!!!
   - In the CF Pages console, select `Connect to Git`, then select the `edgetunnel` project and click `Begin setup`.
   - On the `Set up builds and deployments` page below, select `Environment variables (advanced)` and `Add variable`.
     Fill in **UUID** as the variable name, and your UUID as the value, then click `Save and deploy`.

2. Access Subscription Content:
   - Visit `https://[YOUR-PAGES-URL]/[YOUR-UUID]` to get the subscription content.
   - For example, `https://edgetunnel.pages.dev/90cd4a77-141a-43c9-991b-08263cfe9c10` is your universal adaptive subscription address.
   - For example, `https://edgetunnel.pages.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?sub` is the Base64 subscription format, suitable for PassWall, SSR+, etc.
   - For example, `https://edgetunnel.pages.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?clash` is the Clash subscription format, suitable for OpenClash, etc.
   - For example, `https://edgetunnel.pages.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?sb` is the Singbox subscription format, suitable for Singbox, etc.

3. Bind CNAME custom domain to Pages: [Video Tutorial](https://www.youtube.com/watch?v=LeT4jQUh8ok&t=851s)
   - In the Pages console, go to the `Custom domains` tab, then click `Set up a custom domain` below.
   - Fill in your custom secondary domain, note that you should not use your root domain. For example:
     If your assigned domain is `fuck.cloudns.biz`, then fill in `lizi.fuck.cloudns.biz` to add a custom domain;
   - According to CF's requirements, return to your domain's DNS provider, add a CNAME record `edgetunnel.pages.dev` for this custom domain `lizi`, then click `Activate domain`.
   - **If you are a novice, then after binding your custom domain to Pages, you can take off directly, no need to read further!!!**

4. Use subscription content with your own `optimized domain`/`optimized IP`:
   - If you want to use your own optimized domain or optimized IP, you can refer to the deployment instructions in the [WorkerVless2sub GitHub repository](https://github.com/cmliu/WorkerVless2sub) to set it up yourself.
   - In the Pages console, go to the `Settings` tab, select `Environment variables` > `Create` > `Edit variables` > `Add variable`;
   - Set the variable name to `SUB`, and the corresponding value to the address of your deployed subscription generator. For example, `sub.cmliussss.workers.dev`, then click **Save**.
   - Then in the Pages console, go to the `Deployments` tab, select `All deployments` > `...` on the far right of the latest deployment > `Retry deployment`.
   - Note that if you use your own subscription address, the `SUB` domain of the subscription generator and the domain of `[YOUR-PAGES-URL]` must not belong to the same top-level domain, otherwise an anomaly will occur. You can assign the Pages.dev allocated domain to the `SUB` variable.

</details>

# Variable Description
| Variable Name | Example | Required | Notes | YT |
|---|---|---|---|---|
| UUID | `90cd4a77-141a-43c9-991b-08263cfe9c10` |✅| Powershell -NoExit -Command "[guid]::NewGuid()"| [Video](https://www.youtube.com/watch?v=s91zjpw3-P8&t=72s) |
| KEY | `token` |❌| Dynamic UUID secret key. When using the `KEY` variable, the `UUID` variable will no longer be enabled. | |
| TIME | `7` |❌| Dynamic UUID validity period (unit: days) | |
| UPTIME | `3` |❌| Dynamic UUID update time (default: `3` AM Beijing time) | |
| PROXYIP | `proxyip.fxxk.dedyn.io:443` |❌| Alternative proxy node for accessing CFCDN sites (supports custom ProxyIP ports, supports multiple ProxyIPs, use `,` or newline as separator between ProxyIPs) | [Video](https://www.youtube.com/watch?v=s91zjpw3-P8&t=166s) |
| SOCKS5 | `user:password@127.0.0.1:1080` |❌| Priority SOCKS5 proxy for accessing CFCDN sites (supports multiple socks5, use `,` or newline as separator between socks5) | [Video](https://www.youtube.com/watch?v=s91zjpw3-P8&t=826s) |
| GO2SOCKS5 | `blog.cmliussss.com`,`*.ip111.cn`,`*google.com` |❌| After setting the `SOCKS5` variable, you can set a forced SOCKS5 access list (`*` can be used as a wildcard, newline as a separator for multiple elements) | |
| ADD | `icook.tw:2053#Official Optimized Domain` |❌| Local optimized TLS domain/optimized IP (supports multiple elements, use `,` or newline as separator) | |
| ADDAPI | [https://raw.github.../addressesapi.txt](https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesapi.txt) |❌| API address for optimized IPs (supports multiple elements, use `,` or newline as separator) | |
| ADDNOTLS | `icook.hk:8080#Official Optimized Domain` |❌| Local optimized noTLS domain/optimized IP (supports multiple elements, use `,` or newline as separator) | |
| ADDNOTLSAPI | [https://raw.github.../addressesapi.txt](https://raw.githubusercontent.com/cmliu/CFcdnVmess2sub/main/addressesapi.txt) |❌| API address for optimized IPs (supports multiple elements, use `,` or newline as separator) | |
| ADDCSV | [https://raw.github.../addressescsv.csv](https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressescsv.csv) |❌| iptest speed test results (supports multiple elements, use `,` as separator between elements) | |
| DLS | `8` |❌| `ADDCSV` speed test results meet the minimum speed requirement | |
| TGTOKEN | `6894123456:XXXXXXXXXX0qExVsBPUhHDAbXXX` |❌| Bot token for sending TG notifications |
| TGID | `6946912345` |❌| Digital ID of the account receiving TG notifications |
| SUB | `VLESS.fxxk.dedyn.io` | ❌ | Subscription generator address for built-in domain and IP node information | [Video](https://www.youtube.com/watch?v=s91zjpw3-P8&t=1193s) |
| SUBAPI | `SUBAPI.fxxk.dedyn.io` |❌| Backend for Clash, Singbox, etc. subscription conversion | [Video](https://www.youtube.com/watch?v=s91zjpw3-P8&t=1446s) |
| SUBCONFIG | [https://raw.github.../ACL4SSR_Online_Full_MultiMode.ini](https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online__Full_MultiMode.ini) |❌| Configuration file for Clash, Singbox, etc. subscription conversion | [Video](https://www.youtube.com/watch?v=s91zjpw3-P8&t=1605s) |
| SUBNAME | `edgetunnel` |❌| Subscription name | |
| RPROXYIP | `false` |❌| Set to true to force obtaining the ProxyIP assigned by the subscriber (requires subscriber support) | [Video](https://www.youtube.com/watch?v=s91zjpw3-P8&t=1816s) |
| URL302 | `https://t.me/CMLiussss` |❌| Homepage 302 redirect (supports multiple URLs, use `,` or newline as separator, novices should not use) | |
| URL | `https://blog.cmliussss.com` |❌| Homepage reverse proxy disguise (supports multiple URLs, use `,` or newline as separator, incorrect settings may trigger anti-fraud) | |
| CFPORTS | `2053`,`2096`,`8443` |❌| Standard port list for CF accounts | |

**Note: After filling in `KEY`, `UUID` will no longer be enabled! Please choose one to use!!!**
1. After filling in `KEY`, the permanent subscription address is `https://[YOUR-URL]/[YOUR-KEY]`;
2. After filling in `KEY`, the temporary subscription address is `https://[YOUR-URL]/[YOUR-UUID]`;
3. The usage time for **dynamic UUID** subscriptions is **1** `TIME` validity period;
4. The usage time for **dynamic UUID** nodes is **2** `TIME` validity periods (meaning even if the dynamic UUID expires, the node can still be used for one more period, but subscriptions cannot be updated).

**Note: After filling in `SOCKS5`, `PROXYIP` will no longer be enabled! Please choose one to use!!!**

**Note: After filling in `SUB`, subscription content generated by `ADD*` variables will no longer be enabled! Please choose one to use!!!**

## Useful Tips

**The subscription deployed by this project can quickly switch optimized subscription generators by adding the `sub` key-value!**
> For example, `https://edgetunnel.pages.dev/90cd4a77-141a-43c9-991b-08263cfe9c10` is your universal adaptive subscription address.

- Quickly switch the subscriber to the subscription address of `VLESS.fxxk.dedyn.io`
  
   ```url
   https://edgetunnel.pages.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?sub=VLESS.fxxk.dedyn.io
   ```

**The nodes deployed by this project can use specified `PROXYIP` or `SOCKS5` through node PATH (path)!**

- Specify `PROXYIP` example
   ```url
   /proxyip=proxyip.fxxk.dedyn.io
   /?proxyip=proxyip.fxxk.dedyn.io
   /proxyip.fxxk.dedyn.io (only for domains starting with 'proxyip.')
   ```

- Specify `SOCKS5` example
   ```url
   /socks5=user:password@127.0.0.1:1080
   /?socks5=user:password@127.0.0.1:1080
   /socks://dXNlcjpwYXNzd29yZA==@127.0.0.1:1080
   /socks5://user:password@127.0.0.1:1080
   ```

**When your `ADDAPI` can be used as `PROXYIP`, you can add `?proxyip=true` at the end of the `ADDAPI` variable to use the optimized IP itself as `PROXYIP` when generating nodes.**
- Specify `ADDAPI` as `PROXYIP` example
   ```url
   https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesapi.txt?proxyip=true
   ```

## Star it up
[![Stargazers over time](https://starchart.cc/cmliu/edgetunnel.svg?variant=adaptive)](https://starchart.cc/cmliu/edgetunnel)

## Adapted Clients
### Windows
   - [v2rayN](https://github.com/2dust/v2rayN)
   - clash.meta ([FlClash](https://github.com/chen08209/FlClash), [clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev), [Clash Nyanpasu](https://github.com/keiko233/clash-nyanpasu))
### IOS
   - Surge, Shadowrocket
   - sing-box ([SFI](https://sing-box.sagernet.org/zh/clients/apple/))
### Android
   - clash.meta ([ClashMetaForAndroid](https://github.com/MetaCubeX/ClashMetaForAndroid), [FlClash](https://github.com/chen08209/FlClash))
   - sing-box ([SFA](https://github.com/SagerNet/sing-box))
### MacOS
   - clash.meta ([FlClash](https://github.com/chen08209/FlClash))

# Thanks
[zizifn](https://github.com/zizifn/edgetunnel), [3Kmfi6HP](https://github.com/6Kmfi6HP/EDtunnel), [Stanley-baby](https://github.com/Stanley-baby), [ACL4SSR](https://github.com/ACL4SSR/ACL4SSR/tree/master/Clash/config), [SHIJS1999](https://github.com/SHIJS1999/cloudflare-worker-vless-ip), <a href="https://url.cmliussss.com/alice"><img src="https://alicenetworks.net/templates/lagom2/assets/img/logo/logo_big.194980063.png" width="150" height="75" alt="Alice Networks LTD"/></a>,