import socket

print("hi")
def send_start_signal():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    target_address = ('127.0.0.1', 7500)

    sock.sendto(b'202', target_address)
    sock.close()
    print("sending signal to traffic generator")

send_start_signal()
