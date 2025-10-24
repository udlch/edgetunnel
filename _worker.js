import { connect } from "cloudflare:sockets";
let userID;
let proxyIP = '';
let sub = '';
let subapi = "SUBAPI.fxxk.dedyn.io";
let subconfig = "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiMode.ini";
let subProtocol = "https";
let socks5 = '';
let socks5_config = {};
let socks5_enabled = false;
let dynamicTime;
let dynamicUUID;
let noTLS = "false";
let proxyIPs;
let socks5_hosts;
let blockDomains = ["*ttvnw.net", "*tapecontent.net", "*cloudatacdn.com", "*.loadshare.org"];
let addresses = [];
let addressesapi = [];
let addressesnotls = [];
let addressesnotlsapi = [];
let addressescsv = [];
let dls = 8;
let subname = atob("ZWRnZXR1bm5lbA==");
let tgtoken;
let tgid;
let temp_proxy_domain = [];
let temp_proxy_ip = '';
let rproxyip = "false";
let cfports = ["2053", "2083", "2087", "2096", "8443"];
let time = 7;
let uptime = 3;
let fk_id;
let sub_uuid_key = [];

export default {
    async fetch(request, env, ctx) {
        try {
            const userAgent = request.headers.get("User-Agent") || "null";
            const userAgent_low = userAgent.toLowerCase();
            if (env.KEY) {
                time = env.TIME || time;
                uptime = env.UPTIME || uptime;
                const dynamicKeys = await getDynamicUUID(env.KEY);
                userID = dynamicKeys[0];
            } else {
                if (env.UUID) {
                    userID = env.UUID;
                }
            }

            const errorResponse = {
                status: 404
            };

            if (!userID) {
                return new Response("Please set your UUID variable, or try redeploying and check if the variable is effective.", errorResponse);
            }

            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const today_timestamp = Math.ceil(now.getTime() / 1000);
            const hash = await sha256('' + userID + today_timestamp);

            fk_id = [hash.slice(0, 8), hash.slice(8, 12), hash.slice(12, 16), hash.slice(16, 20), hash.slice(20)].join("-");
            sub_uuid_key = hash.slice(6, 9) + "." + hash.slice(13, 19);

            proxyIP = env.PROXYIP || proxyIP;
            proxyIPs = await parseAddresses(proxyIP);
            proxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];

            socks5 = env.SOCKS5 || socks5;
            socks5_hosts = await parseAddresses(socks5);
            socks5 = socks5_hosts[Math.floor(Math.random() * socks5_hosts.length)];
            socks5 = socks5.split("//")[1] || socks5;

            if (env.CFPORTS) {
                cfports = await parseAddresses(env.CFPORTS);
            }

            sub = env.SUB || sub;
            subapi = env.SUBAPI || subapi;
            if (subapi.includes("http://")) {
                subapi = subapi.split("//")[1];
                subProtocol = "http";
            } else {
                subapi = subapi.split("//")[1] || subapi;
            }

            subconfig = env.SUBCONFIG || subconfig;

            if (socks5) {
                try {
                    socks5_config = parseSocks5(socks5);
                    rproxyip = env.RPROXYIP || "false";
                    socks5_enabled = true;
                } catch (e) {
                    console.log(e.toString());
                    rproxyip = env.RPROXYIP || !proxyIP ? "true" : "false";
                    socks5_enabled = false;
                }
            } else {
                rproxyip = env.RPROXYIP || !proxyIP ? "true" : "false";
            }

            if (env.ADD) addresses = await parseAddresses(env.ADD);
            if (env.ADDAPI) addressesapi = await parseAddresses(env.ADDAPI);
            if (env.ADDNOTLS) addressesnotls = await parseAddresses(env.ADDNOTLS);
            if (env.ADDNOTLSAPI) addressesnotlsapi = await parseAddresses(env.ADDNOTLSAPI);
            if (env.ADDCSV) addressescsv = await parseAddresses(env.ADDCSV);

            dls = env.DLS || dls;
            tgtoken = env.TGTOKEN || tgtoken;
            tgid = env.TGID || tgid;

            if (env.GO2SOCKS5) {
                blockDomains = await parseAddresses(env.GO2SOCKS5);
            }

            const upgradeHeader = request.headers.get("Upgrade");
            const url = new URL(request.url);

            if (url.searchParams.has("sub") && url.searchParams.get("sub") !== '') {
                sub = url.searchParams.get("sub");
            }

            subname = env.SUBNAME || subname;

            if (url.searchParams.has("notls")) {
                noTLS = "true";
            }

            if (!upgradeHeader || upgradeHeader !== "websocket") {
                const pathname = url.pathname.toLowerCase();
                if (pathname === "/") {
                    if (env.URL302) {
                        return Response.redirect(env.URL302, 302);
                    } else if (env.URL) {
                        return await proxyRequest(env.URL, url);
                    } else {
                        return new Response(JSON.stringify(request.cf, null, 4), {
                            status: 200,
                            headers: {
                                "content-type": "application/json"
                            }
                        });
                    }
                } else if (pathname === "/" + fk_id) {
                    const subscription = await generateSubscription(userID, request.headers.get("Host"), sub, "CF-Workers-SUB", rproxyip, url, env);
                    return new Response('' + subscription, {
                        status: 200
                    });
                } else if (pathname === "/" + env.KEY || pathname === "/" + userID) {
                    await sendTelegramMessage("#Get_Subscription " + subname, request.headers.get("CF-Connecting-IP"), "UA: " + userAgent + "</tg-spoiler>\nDomain: " + url.hostname + "\n<tg-spoiler>Entry: " + (url.pathname + url.search) + "</tg-spoiler>");
                    const subscription = await generateSubscription(userID, request.headers.get("Host"), sub, userAgent, rproxyip, url, env);
                    const now_ms = Date.now();
                    const today_start = new Date(now_ms);
                    today_start.setHours(0, 0, 0, 0);
                    const usage = Math.floor((now_ms - today_start.getTime()) / 86400000 * 24 * 10000000000 / 2);

                    if (userAgent_low && userAgent_low.includes("mozilla")) {
                        const headers = {
                            "Content-Type": "text/plain;charset=utf-8",
                            "Profile-Update-Interval": "6",
                            "Subscription-Userinfo": `upload=${usage}; download=${usage}; total=26388279066624; expire=4102416000`
                        };
                        return new Response('' + subscription, {
                            status: 200,
                            headers: headers
                        });
                    } else {
                        return new Response('' + subscription, {
                            status: 200,
                            headers: {
                                "Content-Disposition": `attachment; filename=${subname}; filename*=utf-8''${encodeURIComponent(subname)}`,
                                "Content-Type": "text/plain;charset=utf-8",
                                "Profile-Update-Interval": "6",
                                "Subscription-Userinfo": `upload=${usage}; download=${usage}; total=26388279066624; expire=4102416000`
                            }
                        });
                    }
                } else {
                    if (env.URL302) {
                        return Response.redirect(env.URL302, 302);
                    } else if (env.URL) {
                        return await proxyRequest(env.URL, url);
                    } else {
                        return new Response('', {
                            status: 404
                        });
                    }
                }
            } else {
                proxyIP = url.searchParams.get("proxyip") || proxyIP;
                if (new RegExp("/proxyip=", "i").test(url.pathname)) {
                    proxyIP = url.pathname.toLowerCase().split("/proxyip=")[1];
                } else if (new RegExp("/proxyip.", "i").test(url.pathname)) {
                    proxyIP = "proxyip." + url.pathname.toLowerCase().split("/proxyip.")[1];
                }

                socks5 = url.searchParams.get("socks5") || socks5;
                if (new RegExp("/socks5=", "i").test(url.pathname)) {
                    socks5 = url.pathname.split("5=")[1];
                } else if (new RegExp("/socks://", "i").test(url.pathname) || new RegExp("/socks5://", "i").test(url.pathname)) {
                    socks5 = url.pathname.split("://")[1].split("#")[0];
                    if (socks5.includes("@")) {
                        let auth = socks5.split("@")[0];
                        const base64Regex = /^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=)?$/i;
                        if (base64Regex.test(auth) && !auth.includes(":")) {
                            auth = atob(auth);
                        }
                        socks5 = auth + "@" + socks5.split("@")[1];
                    }
                }

                if (socks5) {
                    try {
                        socks5_config = parseSocks5(socks5);
                        socks5_enabled = true;
                    } catch (e) {
                        console.log(e.toString());
                        socks5_enabled = false;
                    }
                } else {
                    socks5_enabled = false;
                }
                return await handleVLESSRequest(request);
            }
        } catch (e) {
            return new Response(e.toString());
        }
    }
};

async function handleVLESSRequest(request) {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    server.accept();

    let remoteConnection = '';
    let remoteConnectionPort = '';

    const log = (msg, ...args) => {
        console.log("[" + remoteConnection + ":" + remoteConnectionPort + "] " + msg, ...args || '');
    };

    const secWebsocketProtocol = request.headers.get("sec-websocket-protocol") || '';
    const readableWebSocketStream = createReadableWebSocketStream(server, secWebsocketProtocol, log);

    const remoteConnectionWrapper = {
        value: null
    };
    let hasIncomingData = false;

    readableWebSocketStream.pipeTo(new WritableStream({
        async write(chunk, controller) {
            if (hasIncomingData) {
                return await handleDNSQuery(chunk, server, null, log);
            }

            if (remoteConnectionWrapper.value) {
                const writer = remoteConnectionWrapper.value.writable.getWriter();
                await writer.write(chunk);
                writer.releaseLock();
                return;
            }

            const {
                hasError,
                message,
                addressType,
                portRemote = 2053,
                addressRemote = '',
                rawDataIndex,
                vlessVersion = new Uint8Array([0, 0]),
                isUDP
            } = parseVLESSHeader(chunk, userID);

            remoteConnection = addressRemote;
            remoteConnectionPort = portRemote + "--" + Math.random() + " " + (isUDP ? "udp " : "tcp ") + " ";

            if (hasError) {
                throw new Error(message);
            }

            if (isUDP) {
                if (portRemote === 53) {
                    hasIncomingData = true;
                } else {
                    throw new Error("UDP proxy is only enabled for DNS (port 53)");
                }
            }

            const vlessResponse = new Uint8Array([vlessVersion[0], 0]);
            const rawData = chunk.slice(rawDataIndex);

            if (hasIncomingData) {
                return handleDNSQuery(rawData, server, vlessResponse, log);
            }

            log("Handling TCP outbound to " + addressRemote + ":" + portRemote);
            connectToRemote(remoteConnectionWrapper, addressType, addressRemote, portRemote, rawData, server, vlessResponse, log);
        },
        close() {
            log("readableWebSocketStream closed");
        },
        abort(e) {
            log("readableWebSocketStream aborted", JSON.stringify(e));
        }
    })).catch(e => {
        log("readableWebSocketStream pipe error", e);
    });

    return new Response(null, {
        status: 101,
        webSocket: client
    });
}

async function connectToRemote(remoteConnectionWrapper, addressType, addressRemote, portRemote, rawData, webSocket, vlessResponse, log) {
    async function isBlocked(domain) {
        if (blockDomains.includes(atob("YWxsIGlu")) || blockDomains.includes(atob("Kg=="))) {
            return true;
        }
        return blockDomains.some(d => {
            let pattern = d.replace(/\*/g, ".*");
            let regex = new RegExp(`^${pattern}$`, "i");
            return regex.test(domain);
        });
    }

    async function connectAndPipe(hostname, port, useSocks = false) {
        log("connected to " + hostname + ":" + port);
        const remoteSocket = useSocks ? await connectSocks5(addressType, hostname, port, log) : connect({
            hostname: hostname,
            port: port
        });
        remoteConnectionWrapper.value = remoteSocket;
        const writer = remoteSocket.writable.getWriter();
        await writer.write(rawData);
        writer.releaseLock();
        return remoteSocket;
    }

    async function retryConnection() {
        if (socks5_enabled) {
            connection = await connectAndPipe(addressRemote, portRemote, true);
        } else {
            if (!proxyIP || proxyIP == '') {
                proxyIP = atob("UFJPWFlJUC50cDEuZnh4ay5kZWR5bi5pbw==");
            } else {
                if (proxyIP.includes("]:")) {
                    portRemote = proxyIP.split("]:")[1] || portRemote;
                    proxyIP = proxyIP.split("]:")[0] || proxyIP;
                } else if (proxyIP.split(":").length === 2) {
                    portRemote = proxyIP.split(":")[1] || portRemote;
                    proxyIP = proxyIP.split(":")[0] || proxyIP;
                }
            }
            if (proxyIP.includes(".tp")) {
                portRemote = proxyIP.split(".tp")[1].split(".")[0] || portRemote;
            }
            connection = await connectAndPipe(proxyIP || addressRemote, portRemote);
        }

        connection.closed.catch(e => {
            console.log("retry tcpSocket closed error", e);
        }).finally(() => {
            closeWebSocket(webSocket);
        });

        pipeStreams(connection, webSocket, vlessResponse, null, log);
    }

    let isDomainBlocked = false;
    if (blockDomains.length > 0 && socks5_enabled) {
        isDomainBlocked = await isBlocked(addressRemote);
    }

    let connection = await connectAndPipe(addressRemote, portRemote, isDomainBlocked);
    pipeStreams(connection, webSocket, vlessResponse, retryConnection, log);
}

function createReadableWebSocketStream(server, secWebsocketProtocol, log) {
    let isClosed = false;
    const stream = new ReadableStream({
        start(controller) {
            server.addEventListener("message", event => {
                if (isClosed) return;
                const data = event.data;
                controller.enqueue(data);
            });
            server.addEventListener("close", () => {
                closeWebSocket(server);
                if (isClosed) return;
                controller.close();
            });
            server.addEventListener("error", e => {
                log("WebSocket server error");
                controller.error(e);
            });
            const { earlyData, error } = urlsafe_b64decode(secWebsocketProtocol);
            if (error) {
                controller.error(error);
            } else if (earlyData) {
                controller.enqueue(earlyData);
            }
        },
        pull(controller) {},
        cancel(reason) {
            if (isClosed) return;
            log("ReadableStream canceled, reason: " + reason);
            isClosed = true;
            closeWebSocket(server);
        }
    });
    return stream;
}

function parseVLESSHeader(data, uuid) {
    if (data.byteLength < 24) {
        return {
            hasError: true,
            message: "invalid data"
        };
    }
    const version = new Uint8Array(data.slice(0, 1));
    let isValidUser = false;
    let isUDP = false;

    function checkUser(user, expected1, expected2) {
        const receivedUUID = new Uint8Array(user.slice(1, 17));
        const hashedUUID = generateVLESSUUID(receivedUUID);
        return hashedUUID === expected1 || hashedUUID === expected2;
    }

    isValidUser = checkUser(data, uuid, fk_id);

    if (!isValidUser) {
        return {
            hasError: true,
            message: "invalid user " + new Uint8Array(data.slice(1, 17))
        };
    }

    const optLen = new Uint8Array(data.slice(17, 18))[0];
    const command = new Uint8Array(data.slice(18 + optLen, 18 + optLen + 1))[0];

    if (command === 1) { // TCP
    } else if (command === 2) { // UDP
        isUDP = true;
    } else {
        return {
            hasError: true,
            message: `command ${command} is not support, command 01-tcp,02-udp,03-mux`
        };
    }

    const portIndex = 18 + optLen + 1;
    const portBuffer = data.slice(portIndex, portIndex + 2);
    const remotePort = new DataView(portBuffer).getUint16(0);

    let addressIndex = portIndex + 2;
    const addressType = new Uint8Array(data.slice(addressIndex, addressIndex + 1))[0];
    let addressLength = 0;
    let addressIndexOffset = addressIndex + 1;
    let remoteHost = '';

    switch (addressType) {
        case 1: // IPv4
            addressLength = 4;
            remoteHost = new Uint8Array(data.slice(addressIndexOffset, addressIndexOffset + addressLength)).join(".");
            break;
        case 2: // Domain
            addressLength = new Uint8Array(data.slice(addressIndexOffset, addressIndexOffset + 1))[0];
            addressIndexOffset += 1;
            remoteHost = new TextDecoder().decode(data.slice(addressIndexOffset, addressIndexOffset + addressLength));
            break;
        case 3: // IPv6
            addressLength = 16;
            const ipv6 = new DataView(data.slice(addressIndexOffset, addressIndexOffset + addressLength));
            const ipv6Parts = [];
            for (let i = 0; i < 8; i++) {
                ipv6Parts.push(ipv6.getUint16(i * 2).toString(16));
            }
            remoteHost = ipv6Parts.join(":");
            break;
        default:
            return {
                hasError: true,
                message: `invalid addressType is ${addressType}`
            };
    }

    if (!remoteHost) {
        return {
            hasError: true,
            message: `addressValue is empty, addressType is ${addressType}`
        };
    }

    return {
        hasError: false,
        addressRemote: remoteHost,
        addressType: addressType,
        portRemote: remotePort,
        rawDataIndex: addressIndexOffset + addressLength,
        vlessVersion: version,
        isUDP: isUDP
    };
}

async function pipeStreams(remoteSocket, webSocket, vlessResponse, retry, log) {
    let remoteChunk = vlessResponse;
    let hasSent = false;
    await remoteSocket.readable.pipeTo(new WritableStream({
        start() {},
        async write(chunk, controller) {
            hasSent = true;
            if (webSocket.readyState !== 1) {
                controller.error("webSocket.readyState is not open, maybe close");
            }
            if (remoteChunk) {
                webSocket.send(await new Blob([remoteChunk, chunk]).arrayBuffer());
                remoteChunk = null;
            } else {
                webSocket.send(chunk);
            }
        },
        close() {
            log("remoteConnection!.readable is close with hasIncomingData is " + hasSent);
        },
        abort(e) {
            console.error("remoteConnection!.readable abort", e);
        }
    })).catch(e => {
        console.error("remoteSocketToWS has exception ", e.stack || e);
        closeWebSocket(webSocket);
    });

    if (hasSent === false && retry) {
        log("retry");
        retry();
    }
}

function urlsafe_b64decode(data) {
    if (!data) {
        return { error: null };
    }
    try {
        data = data.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = atob(data);
        const buffer = Uint8Array.from(decoded, c => c.charCodeAt(0));
        return {
            earlyData: buffer.buffer,
            error: null
        };
    } catch (e) {
        return { error: e };
    }
}

function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

function closeWebSocket(ws) {
    try {
        if (ws.readyState === 1 || ws.readyState === 2) {
            ws.close();
        }
    } catch (e) {
        console.error("safeCloseWebSocket error", e);
    }
}

const hexTable = [];
for (let i = 0; i < 256; ++i) {
    hexTable.push((i + 256).toString(16).slice(1));
}

function generateVLESSUUID(bytes, offset = 0) {
    return (hexTable[bytes[offset + 0]] + hexTable[bytes[offset + 1]] + hexTable[bytes[offset + 2]] + hexTable[bytes[offset + 3]] + "-" + hexTable[bytes[offset + 4]] + hexTable[bytes[offset + 5]] + "-" + hexTable[bytes[offset + 6]] + hexTable[bytes[offset + 7]] + "-" + hexTable[bytes[offset + 8]] + hexTable[bytes[offset + 9]] + "-" + hexTable[bytes[offset + 10]] + hexTable[bytes[offset + 11]] + hexTable[bytes[offset + 12]] + hexTable[bytes[offset + 13]] + hexTable[bytes[offset + 14]] + hexTable[bytes[offset + 15]]).toLowerCase();
}

function generateUUID(uuid, offset = 0) {
    const formattedUUID = generateVLESSUUID(uuid, offset);
    if (!isValidUUID(formattedUUID)) {
        throw TypeError("Generated UUID is not valid: " + formattedUUID);
    }
    return formattedUUID;
}

async function handleDNSQuery(data, webSocket, vlessResponse, log) {
    try {
        let responseChunk = vlessResponse;
        const dnsServer = {
            hostname: "8.8.4.4",
            port: 53
        };
        const dnsConnection = connect(dnsServer);
        log("Connecting to 8.8.4.4:53");
        const writer = dnsConnection.writable.getWriter();
        await writer.write(data);
        writer.releaseLock();
        await dnsConnection.readable.pipeTo(new WritableStream({
            async write(chunk) {
                if (webSocket.readyState === 1) {
                    if (responseChunk) {
                        webSocket.send(await new Blob([responseChunk, chunk]).arrayBuffer());
                        responseChunk = null;
                    } else {
                        webSocket.send(chunk);
                    }
                }
            },
            close() {
                log("DNS Server (8.8.4.4) TCP connection closed");
            },
            abort(e) {
                console.error("DNS Server (8.8.4.4) TCP connection aborted", e);
            }
        }));
    } catch (e) {
        console.error("handleDNSQuery function exception: " + e.message);
    }
}

async function connectSocks5(addressType, remoteHost, remotePort, log) {
    const { username, password, hostname, port } = socks5_config;
    const socks5_conn = connect({ hostname, port });
    const greeting = new Uint8Array([5, 2, 0, 2]);
    const writer = socks5_conn.writable.getWriter();
    await writer.write(greeting);
    log("Sent SOCKS5 greeting");
    const reader = socks5_conn.readable.getReader();
    let response = (await reader.read()).value;

    if (response[0] !== 5) {
        log("SOCKS5 server version error: received " + response[0] + ", expected 5");
        return;
    }
    if (response[1] === 255) {
        log("Server does not accept any authentication methods");
        return;
    }
    if (response[1] === 2) {
        log("SOCKS5 server requires authentication");
        if (!username || !password) {
            log("Please provide username and password");
            return;
        }
        const authRequest = new Uint8Array([1, username.length, ...new TextEncoder().encode(username), password.length, ...new TextEncoder().encode(password)]);
        await writer.write(authRequest);
        response = (await reader.read()).value;
        if (response[0] !== 1 || response[1] !== 0) {
            log("SOCKS5 server authentication failed");
            return;
        }
    }

    let addressBytes;
    switch (addressType) {
        case 1: // IPv4
            addressBytes = new Uint8Array([1, ...remoteHost.split(".").map(Number)]);
            break;
        case 2: // Domain
            addressBytes = new Uint8Array([3, remoteHost.length, ...new TextEncoder().encode(remoteHost)]);
            break;
        case 3: // IPv6
            addressBytes = new Uint8Array([4, ...remoteHost.split(":").flatMap(part => [parseInt(part.slice(0, 2), 16), parseInt(part.slice(2), 16)])]);
            break;
        default:
            log("Invalid address type: " + addressType);
            return;
    }

    const request = new Uint8Array([5, 1, 0, ...addressBytes, remotePort >> 8, remotePort & 255]);
    await writer.write(request);
    log("Sent SOCKS5 request");
    response = (await reader.read()).value;

    if (response[1] === 0) {
        log("SOCKS5 connection established");
    } else {
        log("SOCKS5 connection failed");
        return;
    }

    writer.releaseLock();
    reader.releaseLock();
    return socks5_conn;
}

function parseSocks5(address) {
    let [auth, host] = address.split("@").reverse();
    let username, password, hostname, port;

    if (host) {
        const authParts = host.split(":");
        if (authParts.length !== 2) {
            throw new Error("Invalid SOCKS address format: auth part must be 'username:password'");
        }
        [username, password] = authParts;
    }

    const hostParts = auth.split(":");
    port = Number(hostParts.pop());
    if (isNaN(port)) {
        throw new Error("Invalid SOCKS address format: port must be a number");
    }
    hostname = hostParts.join(":");
    const ipv6Regex = /^\ Казах.*\ Казах$/;
    if (hostname.includes(":") && !ipv6Regex.test(hostname)) {
        throw new Error("Invalid SOCKS address format: IPv6 address must be enclosed in brackets, e.g., [2001:db8::1]");
    }

    return { username, password, hostname, port };
}

function replaceInSubscription(sub_content, uuid, host, is_base64) {
    if (is_base64) {
        sub_content = atob(sub_content);
    }
    sub_content = sub_content.replace(new RegExp(fk_id, "g"), uuid);
    sub_content = sub_content.replace(new RegExp(sub_uuid_key, "g"), host);

    if (is_base64) {
        sub_content = btoa(sub_content);
    }
    return sub_content;
}

async function sha256(message) {
    const encoder = new TextEncoder();
    const data = await crypto.subtle.digest("MD5", encoder.encode(message));
    const hashArray = Array.from(new Uint8Array(data));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join('');
    const secondHash = await crypto.subtle.digest("MD5", encoder.encode(hashHex.slice(7, 27)));
    const secondHashArray = Array.from(new Uint8Array(secondHash));
    const finalHash = secondHashArray.map(b => b.toString(16).padStart(2, "0")).join('');
    return finalHash.toLowerCase();
}

async function proxyRequest(urlStr, urlObj) {
    const addressList = await parseAddresses(urlStr);
    const targetUrl = addressList[Math.floor(Math.random() * addressList.length)];
    let newUrl = new URL(targetUrl);
    console.log(newUrl);
    let protocol = newUrl.protocol.slice(0, -1) || "https";
    let hostname = newUrl.hostname;
    let path = newUrl.pathname;
    let search = newUrl.search;
    if (path.charAt(path.length - 1) == "/") {
        path = path.slice(0, -1);
    }
    path += urlObj.pathname;
    let newRequestUrl = protocol + "://" + hostname + path + search;
    let response = await fetch(newRequestUrl);
    let newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
    });
    newResponse.headers.set("X-New-URL", newRequestUrl);
    return newResponse;
}

async function generateAddresses(host) {
    if ((!sub || sub == '') && addresses.length + addressesapi.length + addressesnotls.length + addressesnotlsapi.length + addressescsv.length == 0) {
        let default_ips = ["103.21.244.0/23", "104.16.0.0/13", "104.24.0.0/14", "172.64.0.0/14", "103.21.244.0/23", "104.16.0.0/14", "104.24.0.0/15", "141.101.64.0/19", "172.64.0.0/14", "188.114.96.0/21", "190.93.240.0/21"];
        function random_ip(cidr) {
            const [ip, prefix] = cidr.split("/");
            const ip_parts = ip.split(".").map(Number);
            const mask_bits = 32 - parseInt(prefix, 10);
            const num_hosts = Math.pow(2, mask_bits) - 1;
            const random_host = Math.floor(Math.random() * num_hosts);
            const random_ip_parts = ip_parts.map((part, i) => {
                if (i < 2) return part;
                if (i === 2) return (part & 255 << mask_bits - 8) + (random_host >> 8 & 255);
                return (part & 255 << mask_bits) + (random_host & 255);
            });
            return random_ip_parts.join(".");
        }
        addresses = addresses.concat("127.0.0.1:1234#CF-NAT");
        if (host.includes(".workers.dev")) {
            addressesnotls = addressesnotls.concat(default_ips.map(cidr => random_ip(cidr) + "#CF-Random-Node"));
        } else {
            addresses = addresses.concat(default_ips.map(cidr => random_ip(cidr) + "#CF-Random-Node"));
        }
    }
}

const subClients = ["sub", "base64", "b64", "clash", "singbox", "sb"];

async function generateSubscription(uuid, host, sub, userAgent, rproxyip, url, env) {
    const path = url.pathname == "/" + env.KEY ? env.KEY : uuid;
    await generateAddresses(host);
    const userAgent_low = userAgent.toLowerCase();
    const [vless_ws_tls, vless_ws_nontls] = createVLESSLinks(uuid, host);
    let clash_config = '';

    if (host.includes(".workers.dev")) {
        if (temp_proxy_ip && (!temp_proxy_domain || temp_proxy_domain.length == 0)) {
            try {
                const response = await fetch(temp_proxy_ip);
                if (!response.ok) {
                    console.error("Error fetching address:", response.status, response.statusText);
                    return;
                }
                const text = await response.text();
                const lines = text.split("\n");
                const filtered_lines = lines.filter(line => line.trim() !== '');
                temp_proxy_domain = temp_proxy_domain.concat(filtered_lines);
            } catch (e) {}
        }
        if (temp_proxy_domain.length > 0) {
            clash_config = `proxy-groups:\n  - name: "${subname}"\n    type: select\n    proxies:${temp_proxy_domain.map(ip => `\n      - ${ip.split(":")[0]}`).join('')}\n` + clash_config;
        }
    }

    if (userAgent_low.includes("mozilla") && !subClients.some(client => url.searchParams.has(client))) {
        let socks5_info = '';
        if (blockDomains.length > 0 && socks5_enabled) {
            socks5_info = '' + decodeURIComponent("SOCKS5(Whitelist): ");
            if (blockDomains.includes(atob("YWxsIGlu")) || blockDomains.includes(atob("Kg=="))) {
                socks5_info += decodeURIComponent("All traffic") + "\n";
            } else {
                socks5_info += "\n  " + blockDomains.join("\n  ") + "\n";
            }
        }
        let sub_info = "\n";
        if (!sub || sub == '') {
            if (socks5_enabled) {
                sub_info += "CFCDN (Access Method): Socks5\n  " + socks5_hosts.join("\n  ") + "\n" + socks5_info;
            } else {
                if (proxyIP && proxyIP != '') {
                    sub_info += "CFCDN (Access Method): ProxyIP\n  " + proxyIPs.join("\n  ") + "\n";
                } else {
                    sub_info += "CFCDN (Access Method): Cannot access, you need to set proxyIP/PROXYIP !!!\n";
                }
            }
            sub_info += "\nYour subscription is provided by built-in addresses/ADD* parameter variables\n";
            if (addresses.length > 0) sub_info += "ADD (TLS Preferred Domain & IP): \n  " + addresses.join("\n  ") + "\n";
            if (addressesnotls.length > 0) sub_info += "ADDNOTLS (noTLS Preferred Domain & IP): \n  " + addressesnotls.join("\n  ") + "\n";
            if (addressesapi.length > 0) sub_info += "ADDAPI (API for TLS Preferred Domain & IP): \n  " + addressesapi.join("\n  ") + "\n";
            if (addressesnotlsapi.length > 0) sub_info += "ADDNOTLSAPI (API for noTLS Preferred Domain & IP): \n  " + addressesnotlsapi.join("\n  ") + "\n";
            if (addressescsv.length > 0) sub_info += `ADDCSV (IPTest speed test csv file, speed limit ${dls}): \n  ` + addressescsv.join("\n  ") + "\n";
        } else {
            if (socks5_enabled) {
                sub_info += "CFCDN (Access Method): Socks5\n  " + socks5_hosts.join("\n  ") + "\n" + socks5_info;
            } else {
                if (proxyIP && proxyIP != '') {
                    sub_info += "CFCDN (Access Method): ProxyIP\n  " + proxyIPs.join("\n  ") + "\n";
                } else {
                    if (rproxyip == "true") {
                        sub_info += "CFCDN (Access Method): Auto Get ProxyIP\n";
                    } else {
                        sub_info += "CFCDN (Access Method): Cannot access, you need to set proxyIP/PROXYIP !!!\n";
                    }
                }
            }
            sub_info += "\nSUB (Subscription Generator): " + sub;
        }

        if (env.KEY && url.pathname !== "/" + env.KEY) {
            sub_info = '';
        } else {
            sub_info += "\nSUBAPI (Subscription Conversion Backend): " + subProtocol + "://" + subapi + "\nSUBCONFIG (Subscription Conversion Config): " + subconfig;
        }

        const dynamic_info = path != uuid ? `TOKEN: ${path}\nUUIDNow: ${uuid}\nUUIDLow: ${fk_id}\nTIME (Dynamic UUID validity): ${time} days\nUPTIME (Dynamic UUID update time): ${uptime}h (Beijing Time)\n\n` : "";
        return `\n################################################################\nSubscribe / sub URL, supports Base64, clash-meta, sing-box formats\n---------------------------------------------------------------\nAdaptive Subscription URL:\nhttps://${_0x28085f}${host}/${path}\nhttps://${_0x28085f}${host}/${path}?sub\n\nBase64 Subscription URL:\nhttps://${_0x28085f}${host}/${path}?b64\nhttps://${_0x28085f}${host}/${path}?base64\n\nClash Subscription URL:\nhttps://${_0x28085f}${host}/${path}?clash\n\nSing-box Subscription URL:\nhttps://${_0x28085f}${host}/${path}?sb\nhttps://${_0x28085f}${host}/${path}?singbox\n---------------------------------------------------------------\n################################################################\n${subname} Configuration Info\n---------------------------------------------------------------\n${dynamic_info}HOST: ${host}\nUUID: ${uuid}\nFKID: ${fk_id}\nUA: ${userAgent}\n${sub_info}\n---------------------------------------------------------------\n################################################################\nv2ray\n---------------------------------------------------------------\n${vless_ws_tls}\n---------------------------------------------------------------\n################################################################\nclash-meta\n---------------------------------------------------------------\n${vless_ws_nontls}\n---------------------------------------------------------------\n################################################################\n` + atob("dGVsZWdyYW0gR3JvdXA6IGh0dHBzOi8vdC5tZS9DTUxpdXNzc3MKLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCmdpdGh1YjogR2l2ZSBhIFN0YXIhU3RhcghTdGFyISEhCmh0dHBzOi8vZ2l0aHViLmNvbS9jbWxpdS9lZGdldHVubmVsCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQojIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIw==") + "\n";
    } else {
        try {
            let sub_content;
            if ((!sub || sub == '') && _0x43a845 == true) {
                sub_content = await generateVlessLinks(sub_uuid_key, fk_id, noTLS, addresses, addressesapi, addressesnotls, addressesnotlsapi);
            } else {
                const response = await fetch(_0x49c260, {
                    headers: {
                        "User-Agent": userAgent + atob("IENGLVdvcmtlcnMtZWRnZXR1bm5lbC9jbWxpdQ==")
                    }
                });
                sub_content = await response.text();
            }
            if (url.pathname == "/" + fk_id) {
                return sub_content;
            }
            return replaceInSubscription(sub_content, uuid, host, _0x43a845);
        } catch (e) {
            return "Error fetching content: " + e.message;
        }
    }
}

async function getCSVAddresses(urls) {
    if (!addressescsv || addressescsv.length === 0) return [];
    let csv_ips = [];
    for (const url of urls) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error("Error fetching CSV address:", response.status, response.statusText);
                continue;
            }
            const text = await response.text();
            let lines;
            if (text.includes("\r\n")) {
                lines = text.split("\r\n");
            } else {
                lines = text.split("\n");
            }
            const header = lines[0].split(",");
            const tls_index = header.indexOf("TLS");
            const remark_index = tls_index + 1;
            if (tls_index === -1) {
                console.error("CSV file is missing required fields");
                continue;
            }
            for (let i = 1; i < lines.length; i++) {
                const row = lines[i].split(",");
                const speed = row.length - 1;
                if (row[tls_index].toUpperCase() === "TRUE" && parseFloat(row[speed]) > dls) {
                    const ip = row[0];
                    const port = row[1];
                    const remark = row[remark_index];
                    const formatted = `${ip}:${port}#${remark}`;
                    csv_ips.push(formatted);
                    if (url.includes("proxyip=true") && row[tls_index].toUpperCase() == "TRUE" && !cfports.includes(port)) {
                        temp_proxy_domain.push(`${ip}:${port}`);
                    }
                }
            }
        } catch (e) {
            console.error("Error fetching CSV address:", e);
            continue;
        }
    }
    return csv_ips;
}

function createVLESSLinks(uuid, host) {
    const vmess_template = atob("dm1lc3M=");
    const link_ws_tls = `${vmess_template}://${uuid}@${host}:443?encryption=none&security=tls&sni=${host}&fp=random&type=ws&host=${host}&path=${encodeURIComponent("/?ed=2560")}#${encodeURIComponent(subname + "-TLS")}`;
    const link_ws_nontls = `${vmess_template}://${uuid}@${host}:80?encryption=none&security=&type=ws&host=${host}&path=${encodeURIComponent("/?ed=2560")}#${encodeURIComponent(subname + "-NoTLS")}`;
    return [link_ws_tls, link_ws_nontls];
}

async function parseAddresses(str) {
    var lines = str.replace(/[|"\'\r\n]+/g, ",").replace(/,+/g, ",");
    if (lines.charAt(0) == ",") {
        lines = lines.slice(1);
    }
    if (lines.charAt(lines.length - 1) == ",") {
        lines = lines.slice(0, lines.length - 1);
    }
    const addresses = lines.split(",");
    return addresses;
}

async function sendTelegramMessage(message, ip, extra_info = '') {
    if (!tgtoken || !tgid) return;
    try {
        let location_info = '';
        const response = await fetch(`http://ip-api.com/json/${ip}?lang=en`);
        if (response.ok) {
            const data = await response.json();
            location_info = `${message}\nIP: ${ip}\nCountry: ${data.country}\n<tg-spoiler>City: ${data.city}\nOrganization: ${data.org}\nASN: ${data.as}\n${extra_info}`;
        } else {
            location_info = `${message}\nIP: ${ip}\n<tg-spoiler>${extra_info}`;
        }
        const url = `https://api.telegram.org/bot${tgtoken}/sendMessage?chat_id=${tgid}&parse_mode=HTML&text=${encodeURIComponent(location_info)}`;
        return fetch(url, {
            method: "GET",
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml;",
                "Accept-Encoding": "gzip, deflate, br",
                "User-Agent": "Mozilla/5.0 Chrome/90.0.4430.72"
            }
        });
    } catch (e) {
        console.error("Error sending telegram message:", e);
    }
}

function isIPv4(ip) {
    const ipv4_regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4_regex.test(ip);
}

async function getDynamicUUID(key) {
    const date_key = new Date(1999, 6, 7, uptime, 0, 0);
    const period = 86400000 * time;
    function getDayDiff() {
        const now = new Date();
        const utc8_now = new Date(now.getTime() + 28800000);
        const diff = utc8_now - date_key;
        return Math.ceil(diff / period);
    }
    function genUUID(str) {
        const encoder = new TextEncoder().encode(str);
        return crypto.subtle.digest("SHA-256", encoder).then(hash => {
            const hashArray = Array.from(new Uint8Array(hash));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join('');
            return `${hashHex.substr(0, 8)}-${hashHex.substr(8, 4)}-4${hashHex.substr(13, 3)}-${(parseInt(hashHex.substr(16, 2), 16) & 0x3f | 0x80).toString(16)}${hashHex.substr(18, 2)}-${hashHex.substr(20, 12)}`;
        });
    }
    const day_diff = getDayDiff();
    const current_date = new Date(date_key.getTime() + day_diff * period);
    const current_uuid = genUUID(key + day_diff);
    const previous_uuid = genUUID(key + (day_diff - 1));
    const expire_date = new Date(current_date.getTime() - 28800000);
    const expire_info = `Expire(UTC): ${expire_date.toISOString().slice(0, 13).replace("T", " ")} (UTC+8): ${current_date.toISOString().slice(0, 13).replace("T", " ")}\n`;
    return Promise.all([current_uuid, previous_uuid, expire_info]);
}
