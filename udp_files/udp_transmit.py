import socket


TRANSMIT_PORT = 7500
DEFAULT_NETWORK = "127.0.0.1"


# sends one equipment ID through UDP port 7500
def broadcast_equipment_id(equipment_id, network_address=DEFAULT_NETWORK):
    message = str(int(equipment_id)).encode("utf-8")

    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        # allows a broadcast address to be used later if the team needs one
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)

        sock.sendto(
            message,
            (network_address, TRANSMIT_PORT)
        )

    print(
        "Broadcast equipment ID:",
        equipment_id,
        "to",
        network_address,
        "port",
        TRANSMIT_PORT
    )
