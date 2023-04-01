#include <unistd.h>
#include <stdlib.h>
#include <sys/reboot.h>

int main() {
    reboot(RB_POWER_OFF);
    return 0;
}

