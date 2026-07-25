#!/usr/bin/env python3
# Oddiy anonim (read-only) FTP server — /srv/ftp. Konteynerda barqaror.
from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer

auth = DummyAuthorizer()
auth.add_anonymous('/srv/ftp')            # faqat o'qish
handler = FTPHandler
handler.authorizer = auth
handler.banner = "ACME backend FTP"
handler.masquerade_address = '172.20.0.20'
handler.passive_ports = range(21100, 21111)
FTPServer(('0.0.0.0', 21), handler).serve_forever()
