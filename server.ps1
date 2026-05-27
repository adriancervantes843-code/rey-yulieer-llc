Add-Type @"
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

public class StaticHttpServer {
    private readonly TcpListener _listener;
    private readonly string _root;
    private readonly Dictionary<string,string> _mime = new Dictionary<string,string> {
        {".html","text/html; charset=utf-8"},
        {".css","text/css; charset=utf-8"},
        {".js","application/javascript; charset=utf-8"},
        {".png","image/png"},
        {".jpg","image/jpeg"},
        {".jpeg","image/jpeg"},
        {".gif","image/gif"},
        {".svg","image/svg+xml"},
        {".ico","image/x-icon"},
        {".woff2","font/woff2"},
        {".woff","font/woff"},
        {".ttf","font/ttf"},
        {".json","application/json"}
    };

    public StaticHttpServer(int port, string root) {
        _root = root;
        _listener = new TcpListener(IPAddress.Loopback, port);
    }

    public void Run() {
        _listener.Start();
        Console.WriteLine("Server running at http://localhost:" + ((IPEndPoint)_listener.LocalEndpoint).Port);
        while (true) {
            var client = _listener.AcceptTcpClient();
            ThreadPool.QueueUserWorkItem(_ => Handle(client));
        }
    }

    private void Handle(TcpClient client) {
        try {
            using (client) {
                var ns = client.GetStream();
                ns.ReadTimeout = 3000;

                // Read until double-CRLF
                var buf = new byte[8192];
                int total = 0;
                try {
                    while (total < buf.Length) {
                        int n = ns.Read(buf, total, buf.Length - total);
                        if (n == 0) break;
                        total += n;
                        string got = Encoding.ASCII.GetString(buf, 0, total);
                        if (got.Contains("\r\n\r\n")) break;
                    }
                } catch { }

                string req = Encoding.ASCII.GetString(buf, 0, total);
                string[] lines = req.Split(new[]{"\r\n"}, StringSplitOptions.None);
                string[] parts = lines[0].Split(' ');
                string url = parts.Length > 1 ? parts[1] : "/";

                // Strip query string and decode
                int q = url.IndexOf('?');
                if (q >= 0) url = url.Substring(0, q);
                url = Uri.UnescapeDataString(url);
                if (string.IsNullOrEmpty(url) || url == "/") url = "/index.html";

                string path = Path.Combine(_root, url.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

                if (File.Exists(path)) {
                    string ext  = Path.GetExtension(path).ToLower();
                    string mime = _mime.ContainsKey(ext) ? _mime[ext] : "application/octet-stream";
                    byte[] body = File.ReadAllBytes(path);
                    string hdr  = "HTTP/1.1 200 OK\r\nContent-Type: " + mime +
                                  "\r\nContent-Length: " + body.Length +
                                  "\r\nConnection: close\r\n\r\n";
                    byte[] hb   = Encoding.ASCII.GetBytes(hdr);
                    ns.Write(hb,   0, hb.Length);
                    ns.Write(body, 0, body.Length);
                    ns.Flush();
                    Console.WriteLine("200 " + url + " (" + body.Length + " b)");
                } else {
                    byte[] body = Encoding.UTF8.GetBytes("Not found");
                    string hdr  = "HTTP/1.1 404 Not Found\r\nContent-Length: " + body.Length +
                                  "\r\nConnection: close\r\n\r\n";
                    byte[] hb   = Encoding.ASCII.GetBytes(hdr);
                    ns.Write(hb,   0, hb.Length);
                    ns.Write(body, 0, body.Length);
                    ns.Flush();
                    Console.WriteLine("404 " + url);
                }
            }
        } catch { }
    }
}
"@

$srv = [StaticHttpServer]::new(3030, $PSScriptRoot)
$srv.Run()
