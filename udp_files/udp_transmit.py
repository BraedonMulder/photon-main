import socket
import time

SOURCE_IP = "127.0.0.1"     # Your local interface ( I will use 192.168.1.2)
PORT = 7501
BROADCAST_IP = "127.0.0.255"  # for testing with the hardware, I will use 192.168.1.255
MESSAGE = "Hello UDP broadcast"

def broadcast_equipment_code(equipment_code, broadcast_ip):

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    # Allow broadcasting
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)

    message = str(equipment_code)

    # Encodes string to bytes with utf-8
    sock.sendto(message.encode("utf-8"), (broadcast_ip, PORT))

    print("Broadcasted equipment code:", message)

    sock.close()

def select_network(code):
    

    choice = input("Enter network: ")
    broadcast_equipment_code(str(code), choice)
    

#test
select_network("ABCD123")

