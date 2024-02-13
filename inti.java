/**
 * int
 */
public class inti {

    public static void main(String[] args) {
        int [][] ss = new int[2][2];
        ss[0][1] = 5;
        ss[0][0] = 1;
        ss[1][1] = 5;
        int [][] ss2 = ss;
        for (int i = 0; i < ss2.length; i++) {
            for (int j = 0; j < ss2.length; j++) {
                System.out.println(ss2[i][j]);
            }
        }
    }
}